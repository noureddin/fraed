////////////////////////////////////////////////////////////////////////////////
// DISPATCH

function render () {

  const hq = hash_param('q', '[a-z0-9]+')
  // console.log('q', hq)
  if (quizes[hq]) {
    quizes[hq]()
  }
  else {
    show_quiz_selection()
    return
  }

  const hs = hash_param('s', '[0-9,-]+')
  // console.log('s', hs)
  if (hs) {
    hs.split(',').forEach(s => {
      if (s.includes('-') && string_has_only_one(s, '-')) {
        const [a, b] = s.split('-')
        for (let i = +a; i <= +b; ++i) { add_sura(i) }
      }
      else {
        add_sura(s)
      }
    })
  }
  if (suar.size === 0) {
    show_suar_selection()
    return
  }

  show_play_screen()

  onkeypress = play
  ondblclick = (ev) => { ev.preventDefault(); play() }
  play()

}

onhashchange = onload = render

////////////////////////////////////////////////////////////////////////////////
// HOME

function show_quiz_selection () {
  ;[el_q, el_a, el_ss, el_n].forEach(el => el.style.display = 'none')
  ;[el_hh, el_qs].forEach(el => el.style.display = 'block')
}

function show_suar_selection () {
  h('s=1,2-114'); return  // TODO
  const hq = quizes[ hash_param('q', '[a-z0-9]+') ](true)  // title_only
  el_q.innerHTML = 'اختبار معرفة ' + el_q.innerHTML
      .r(/^ما /, '')
      .r(/ ال([كف])/g, /*A*/ ' $1')  // الكلمة الفريدة to كلمة وحيدة
      .r(/ به[^ ]+ /, /*A*/ ' ب') // بهذه الكلمة to بكلمة
      .r(/؟ .*/, '')  // no question mark, and no i3rab comment (currently cannot select i3rab from the UI)
  ;[el_qs, el_a, el_n].forEach(el => el.style.display = 'none')
  ;[el_q, el_hh, el_ss].forEach(el => el.style.display = 'block')
}

function show_play_screen () {
  ;[el_hh, el_qs, el_ss].forEach(el => el.style.display = 'none')
  ;[el_q, el_a, el_n].forEach(el => el.style.display = 'block')
}

////////////////////////////////////////////////////////////////////////////////
// QUIZ

let i

const suar = new Set()  // 1-based suar numbers
const add_sura = (s) => {
  s = +s
  if (s >= 1 && s <= 114) { suar.add(s) }
}

function ask () {
  const x = rand_int_if(words.length, (x) => suar.has(S(answers[x])))
  el_a.innerText = words[x]
  i = answers[x]
  // console.log(x, i)
}

function answer () {
  let answer = A[i]
  let sura = N(i)
  while (answer.length < 150 && sura === N(i+1)) {
    answer += ' ' + A[++i]
  }
  el_a.innerText = answer + ' [سورة\xA0' + sura + ']'
  i = null
}

function play () {
  if (i != null) { answer() } else { ask() }
}

