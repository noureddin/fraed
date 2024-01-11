
function make_aayah_start_quiz (num, global, irab, title_only) {
  // title
  q.innerHTML = 'ما الآية ' + (global
    ? 'التي تبدأ ' + (
        num === 1 ? 'بهذه الكلمة الفريدة' :
        num === 2 ? 'بهاتين الكلمتين الفريدتين' :
        num <  11 ? 'بهذه الكلمات الفريدة' :
      '') + ' في القرءان'
    : 'الوحيدة في القرءان التي تبدأ ' + (
        num === 1 ? 'بهذه الكلمة' :
        num === 2 ? 'بهاتين الكلمتين' :
        num <  11 ? 'بهذه الكلمات' :
      '')
    ) + '؟ (' + (
      irab ? 'بمراعاة' : 'بإهمال'
    ) + ' حركة الحرف الأخير)'
  if (title_only) { return }
  // all aayaat of the quran
  const pat = '[^ ]+ '.repeat(num)
  const rep = pat.replace(/ $/, '')
  const pat_re = new RegExp(pat)
  const rep_re = new RegExp(`(${rep}) .*`)
  const discard = num === 1 ? (a) => !a.includes(' ')
                : num === 2 ? (a) => string_has_only_one(a, ' ')
                : num >   2 ? (a) => !a.match(pat_re)
                : null
  const convert = num === 1 ? (a) => unmark(a).replace(/ .*/, '')
                : num === 2 ? (a) => unmark(a).replace(/([^ ]+ [^ ]+) .*/, '$1')
                : num >   2 ? (a) => unmark(a).replace(rep_re, '$1')
                : null
  const _ = irab
    ? A.map(a =>         discard(a) ? '' : convert(a))
    : A.map(a => deirab( discard(a) ? '' : convert(a)))
  // quiz words and answers
  words = global
    ? only_uniq(_).filter(e => WW.has(e))
    : only_uniq(_)
  answers = words.map((w) => _.indexOf(w))
}

function make_any_word_quiz (num, irab, title_only) {
  // title
  q.innerHTML = ('ما الآية التي فيها هذه الكلمة الفريدة في القرءان'
    ) + '؟ (' + (
      irab ? 'بمراعاة' : 'بإهمال'
    ) + ' حركة الحرف الأخير)'
  if (title_only) { return }
  // all aayaat of the quran
  words = W
  answers = WA
}

const quizes = {
 gg: (title_only) => make_any_word_quiz(1, false, title_only),
 gs: (title_only) => make_aayah_start_quiz(1, true, null, title_only),
}

for (let i = 1; i <= 9; ++i) {
  quizes['s'+i      ] = (title_only) => make_aayah_start_quiz(i, false, false, title_only)
  quizes['s'+i + 'i'] = (title_only) => make_aayah_start_quiz(i, false, true, title_only)
}
