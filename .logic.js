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

function start_playing () {  // if haven't started yet; useful when coming from the selection screens.
  if (i === undefined) { ask() }
}


////////////////////////////////////////////////////////////////////////////////
// DISPATCH

function prepare_to_play () {

  const hq = hash_param('q', '[a-z0-9]+')
  // console.log('q', hq)
  if (!quizes[hq]) {
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

  return quizes[hq]

}

let resource_checking_interval
const stop_resource_checking = () => {
  clearInterval(resource_checking_interval)
  resource_checking_interval = null
}

function render (ev) {
  suar.clear()
  stop_resource_checking()  // hash changed

  let load_quiz = prepare_to_play()

  function lets_go () {
    if (A && W && WA) {  // if loaded
      stop_resource_checking()
      if (load_quiz || (load_quiz = prepare_to_play())) {
        load_quiz()
        show_play_screen()
        onkeypress = play
        ondblclick = (ev) => { ev.preventDefault(); play() }
        start_playing()
      }
    }
  }

  resource_checking_interval = setInterval(lets_go, 100)
  lets_go()
}

onhashchange = onload = render


////////////////////////////////////////////////////////////////////////////////
// HOME

function show (ids) { ids.split(' ').forEach(id => Qid(id).style.display = 'block') }
function hide (ids) { ids.split(' ').forEach(id => Qid(id).style.display = 'none')  }

function show_quiz_selection () {
  hide('q a ss n')
  show('hh qs')
}

function show_suar_selection () {
  const hq = quizes[ hash_param('q', '[a-z0-9]+') ](true)  // title_only
  el_q.innerHTML = 'اختبار معرفة ' + el_q.innerHTML
      .r(/^ما /, '')
      .r(/ ال([كف])/g, /*A*/ ' $1')  // الكلمة الفريدة to كلمة وحيدة
      .r(/ به[^ ]+ /,  /*A*/ ' ب')   // بهذه الكلمة to بكلمة
      .r(/؟ .*/, '.')  // no question mark, and no i3rab comment (currently cannot select i3rab from the UI)
  hide('qs a n')
  show('q hh ss')
}

function show_play_screen () {
  hide('hh qs ss')
  show('q a n')
}

