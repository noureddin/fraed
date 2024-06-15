////////////////////////////////////////////////////////////////////////////////
// GENERAL UTILS

function range (start, limit) {  // [start, limit[
  if (limit <= start) { return [] }
  return [...Array(limit).keys()].slice(start)
}

function random_integer (start, limit) {  // [start, limit[
  if (limit == null) { [start, limit] = [0, start - 1] }
  const range = limit - start
  return +start + Math.trunc(range * Math.random())
}

function rand_int_if (limit, pred) {  // [0, limit[
  // pred ||= (i) => true
  do { var i = Math.trunc(limit * Math.random()) } while (!pred(i))
  return i
}

function only_uniq (list) {  // removes repeated elements (not just their duplicates)
  return list.filter((v) => list.lastIndexOf(v) === list.indexOf(v))
}

function string_has_only_one (str, char) {
  return str.lastIndexOf(char) === str.indexOf(char)
}

function hash_param (key, allowed_regex) {
  allowed_regex = new RegExp('^(?:' + allowed_regex + ')$')
  const h = location.hash.slice(1).split('&')
            .map(kv => kv.split('='))
            .filter(([k,v]) => k === key && v.match(allowed_regex))
            .map(([k,v]) => v)
  return h && h[ h.length - 1 ]  // get last param if many are given
}

// function hash_param (key, allowed_regex) {
//   const _ = location.hash.match(new RegExp(`[#&]${key}=(${allowed_regex})(?<=[&#]|$)`, 'g'))
//   // get last param if many are given, and remove '#key=' or '&key='
//   return _ && _[ _.length - 1 ].slice(2 + key.length)
// }

function h (hash_param) {
  location.hash = ((location.hash || '#') + '&' + hash_param).replace(/([#&])&/g, '$1')
}

////////////////////////////////////////////////////////////////////////////////
// SHORTHAND UTILS

String.prototype.r = String.prototype.replace

////////////////////////////////////////////////////////////////////////////////
// AAYAAT STRING UTILS

// remove mosħaf formatting signs
// operates on the aayah string itself
function unmark (aayah) {
  return (aayah
    // on the aayah level
    .r(/\xa0\u06dd[٠١٢٣٤٥٦٧٨٩]+/, '')  // end of ayah
    .r(/\xa0\u06e9/, '')  // place of sajdah
    .r(/\u06de\xa0/, '')  // start of rub el hizb
    // on the word level
    .r(/[\u06d6-\u06dc]+(?=$| )/g, '')  // waqf signs ('+' for 036:052)
    .r(/^(.)\u0651/g, '$1')  // remove initial shadda-of-idgham
    // on the character level
    .r(/\u0305/g, '')  // combining overline
  )
}

function unmark_word (word) {
  return (word
    .r(/^(.)\u0651/g, '$1')  // remove initial shadda-of-idgham
  )
}

// remove final tashkeel signs
// operates on a single-word string
function deirab (word) {
  return (word
    // remove madd-monfasel & madd sela
    .r(/[\u06e4-\u06e6]+$/g, '')
    // remove final tashkeel (except shadda)
    .r(/\u06e1$/,              '')    // jazm (quranic sukun)
    .r(/[\u064e-\u0650]$/,     '')    // fatha, damma, kasra
    .r(/[\u064c\u064d]$/,      '')    // tanween {damm, kasr}
    .r(/[\u08f1\u08f2]$/,      '')    // open tanween {damm, kasr}
    .r(/\u064f\u06e2$/,        '')    // iqlab tanween damm
    .r(/\u0650\u06ed$/,        '')    // iqlab tanween kasr
    .r(/\u064b([اى]?)$/,       '$1')  // tanween fath
    .r(/\u08f0([اى]?)$/,       '$1')  // open tanween fath
    .r(/\u064e\u06e2([اى]?)$/, '$1')  // iqlab tanween fath
    .r(/\u064e([اى]?)$/, '$1')        // just fath, before final alef (either kind), because of tanween (eg, إذا)
    // remove dagger alef from final alef maqsura (its existence depends on the first letter of the next word)
    .r(/(ى)\u0670$/, '$1')
  )
}

////////////////////////////////////////////////////////////////////////////////
// SURA NAME/NUMBER FROM AAYAH INDEX [0-6236[

const suar_names = ['الفاتحة','البقرة','آل\xa0عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس',]

const start_aayah_index = [0,7,293,493,669,789,954,1160,1235,1364,1473,1596,1707,1750,1802,1901,2029,2140,2250,2348,2483,2595,2673,2791,2855,2932,3159,3252,3340,3409,3469,3503,3533,3606,3660,3705,3788,3970,4058,4133,4218,4272,4325,4414,4473,4510,4545,4583,4612,4630,4675,4735,4784,4846,4901,4979,5075,5104,5126,5150,5163,5177,5188,5199,5217,5229,5241,5271,5323,5375,5419,5447,5475,5495,5551,5591,5622,5672,5712,5758,5800,5829,5848,5884,5909,5931,5948,5967,5993,6023,6043,6058,6079,6090,6098,6106,6125,6130,6138,6146,6157,6168,6176,6179,6188,6193,6197,6204,6207,6213,6216,6221,6225,6230,6236]

function S (a) { for (let i = 1; i < 114; ++i) if (start_aayah_index[i] > a) return i }  // returns 1-based sura number
function N (a) { return suar_names[ S(a) - 1 ] }

