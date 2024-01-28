// P  = A | unmark | all_prefix_words |          select shortest uniq per aya
// Pi = A | unmark | all_prefix_words | deirab | select shortest uniq per aya
// PA[i] & PiA[i] are where A[i] includes the prefix P[i] & Pi[i]

String.prototype.all_prefix_words = function () {
  // if it is 'aa bb cc', return ['aa', 'aa bb', 'aa bb cc']
  const [first, ...rest] = this.split(' ')
  return rest.reduce((acc, cur, idx) => {
    return [...acc, acc[acc.length-1] + ' ' + cur]
  }, [first])
}

const AYAT = A.map(unmark)
const P = []
const PA = []
const Pi = []
const PiA = []

const __idx_if_uniq = (pred, dbg, prefix) => {
  const first_find = AYAT.findIndex(pred)
  const last_find  = AYAT.findLastIndex(pred)
  if (first_find === last_find && first_find !== -1) {
    return first_find
  }
  else {
    if (dbg) { console.log(first_find, last_find, prefix) }
    return -1
  }
}

const strict_idx_if_uniq = (prefix, dbg) => {
  return __idx_if_uniq((aya) => aya.startsWith(prefix), dbg, prefix)
}

const deirab_idx_if_uniq = (prefix, dbg) => {
  // reverse deirab() from .utils.js
  const rx = new RegExp('^' + prefix
    .replace(/([اى])$/, '(?:\u064b|\u08f0|\u064e\u06e2)?$1')  // tanween fath
    .replace(/ى$/, '$&\u0670?')  // dagger alef
    + '(?:\u06e1|[\u064e-\u0650]|[\u064c\u064d\u08f1\u08f2]|\u064f\u06e2|\u0650\u06ed)?[\u06e4-\u06e6]* '
    )
  return __idx_if_uniq((aya) => aya.match(rx), dbg, prefix)
}

const push_if_uniq = (prefix, predicate, questions, answers) => {
  const idx = predicate(prefix)
  if (idx !== -1) {
    questions.push(prefix)
    answers.push(idx)
    return true
  }
  return false
}

for (let i = 0; i < AYAT.length; ++i) {
  const a = AYAT[i]
  if (!a.includes(' ')) { continue }  // single word
  const thiz = a.slice(0, a.lastIndexOf(' '))  // without last word
  const contained = (other) => other.startsWith(thiz)
  if (AYAT.findIndex(contained) !== AYAT.findLastIndex(contained)) { continue }
  //
  const prefixes = a.all_prefix_words()
  prefixes.pop()  // ignore last word; we don't want complete aayaat
  let strict_done
  let deirab_done
  for (let prefix of prefixes) {
    if (!strict_done) { strict_done = push_if_uniq(       prefix,  strict_idx_if_uniq, P,  PA ) }
    if (!deirab_done) { deirab_done = push_if_uniq(deirab(prefix), deirab_idx_if_uniq, Pi, PiA) }
    if (deirab_done) { break }
  }
  // if (!deirab_done) { console.log(a) }
}

console.log(P.join(',') + '\n' + PA.join(','))
console.log(Pi.join(',') + '\n' + PiA.join(','))

// // what are uniq prefixes with irab, but no longer uniq without irab
// const pi = P.map(deirab)
// for (let i = 0; i < pi.length; ++i) {
//   const p = pi[i]
//   if (pi.findIndex(a => a === p) !== pi.findLastIndex(a => a === p)) {
//     console.log(P.filter(a => a.startsWith(p)).join('\n'))
//   }
// }

// String.prototype.count_char = function (char) {
//   return this.replace(new RegExp('[^' + char + ']+', 'g'), '').length
// }
// // how many words in the shortest uniq prefixes (with irab)
// console.log(P.map(a => a.count_char(' ')+1).sort((a,b) => b - a))
// // how many words in the shortest uniq prefixes (without irab)
// console.log(Pi.map(a => a.count_char(' ')+1).sort((a,b) => b - a))

