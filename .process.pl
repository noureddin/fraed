#!/usr/bin/env perl
use v5.16; use warnings; use autodie; use utf8;
use open qw[ :encoding(UTF-8) :std ];

sub slurp(_) { local $/; open my $f, '<', $_[0]; return scalar <$f> }
sub slurp_stdin() { local $/; return scalar <> }

sub note { return qq[<small>($_[0])</small>] }

use File::Temp qw[ tempfile ];

my $css = 'deno run --quiet --allow-read --allow-env=HTTP_PROXY,http_proxy npm:clean-css-cli';
my $js  = 'deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js';

## BEGIN

local $_ = slurp_stdin;


## MINIFY HTML

s/>\s+</></g;
s/\A\s+//;
s/\s+\Z//;


## MINIFY CSS

s{<<style>>}{
  sprintf '<style>%s</style>',
  scalar qx[ $css .style.css ]
}ge;


## PROCESS & MINIFY JS

# my $elements =
#   join "\n",
#     map { "const el_$_ = Qid('$_')" }
#       m/ id="([^"]+)"/g;
# s{<<elements>>}{$elements}g;
## almost all the elements are used only in the show_* fns in .logic.js,
## where it's shorter and arguably cleaner to use their ids directly.

s{<<([^<>]*?[.]js)>>}{
  slurp $1
}ge;

my $R = sprintf '[%s]', join ',', qw[ h ];  # global fns defined in JS that are called from HTML

s{<script>(.*?)</script>}{
  my $filename = '.script.js';
  open my $ifh, '>', $filename;
  print { $ifh } $1;
  close $ifh;
  #
  open my $ofh, '>', 'script.js';
  print { $ofh }
  scalar qx[ $js --compress top_retain='$R',passes=10 --mangle toplevel,reserved='$R' .script.js ]
  # scalar qx[ $js $filename ]
  # scalar qx[ cat $filename ]
    =~ s/[;\s]+\Z//r;
  close $ofh;
  unlink $filename;
  '<script src="script.js"></script>'
}sge;

s{(<script) (src=")}{$1 defer $2}g;

#s{<script>(.*?)</script>}{
#  my ($fh, $filename) = tempfile UNLINK => 1;
#  binmode $fh, ':encoding(UTF-8)';
#  print { $fh } $1;
#  close $fh;
#  #
#  sprintf '<script>%s</script>',
#  scalar qx[ $js --compress top_retain=$R,passes=5 --mangle toplevel,reserved=$R $filename ]
#  # scalar qx[ $js $filename ]
#  # scalar qx[ cat $filename ]
#    =~ s/[;\s]+\Z//r
#}sge;


## QUIZ SELECTION HTML

sub quiz_button { my ($quiz, $title) = @_;
  return qq[<nobr><button onclick="h('q=$quiz')">$title</button></nobr>];
  # <nobr> to treate that element as a normal text word for line-breaking, so it won't break `</nobr>.`
}

my $SP = '&emsp; ';

my $qs = (
  'اختبار معرفة '.quiz_button(gs => 'الآية البادئة بكلمة فريدة').' في القرءان،<br>'.
  'أو اختبار معرفة '.quiz_button(gg => 'الآية المحتوية على كلمة فريدة').' في القرءان (صعب).<br>'.
  'أو اختبار معرفة '.quiz_button(ssi => 'الآية الوحيدة في القرءان ذات أقصر بداية معينة').' (مقترح).<br>'.
  'أو اختبار معرفة الآية الوحيدة في القرءان البادئة بكلمات معينة'.' '.note('والتي قد ترد في آيات أخرى في غير بدايتها').":$SP".
  (join "،$SP",
    quiz_button(s1 => 'كلمة واحدة '.note('صعب')),
    quiz_button(s2 => 'كلمتين'),
    quiz_button(s3 => 'ثلاث'),
    quiz_button(s4 => 'أربع'),
    quiz_button(s5 => 'خمس'),
    quiz_button(s6 => 'ست'),
    quiz_button(s7 => 'سبع'),
    quiz_button(s8 => 'ثماني'),
    quiz_button(s9 => 'تسع كلمات '.note('سهل جدا')).'.<br>',
  ).
  note('في جميع هذه الاختبارات، تُهمل حركة الحرف الأخير من الكلمة أو الكلمات.').
'');

s{<<qs>>}{$qs}g;


## SUAR SELECTION HTML

my $ss =  # TODO: for now, all suar are selected
  'ابدأ الاختبار في '
  .qq[<nobr><button onclick="h('s=1,2-114')">جميع السور</button></nobr>]
  .'.'
  ;

s{<<ss>>}{$ss}g;


## END

print;
