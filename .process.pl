#!/usr/bin/env perl
use v5.16; use warnings; use autodie; use utf8;
use open qw[ :encoding(UTF-8) :std ];

sub slurp(_) { local $/; open my $f, '<', $_[0]; return scalar <$f> }
sub slurp_stdin() { local $/; return scalar <> }

sub note { return qq[<small>($_[0])</small>] }

use File::Temp qw[ tempfile ];


## BEGIN

local $_ = slurp_stdin;


## MINIFY HTML

s/>\s+</></g;
s/\A\s+//;
s/\s+\Z//;


## MINIFY CSS

s{<<style>>}{
  sprintf '<style>%s</style>',
  scalar qx[ deno run --quiet --allow-read npm:clean-css-cli .style.css ]
}ge;


## PROCESS & MINIFY JS

my $elements =
  join "\n",
    map { "const el_$_ = Qid('$_')" }
      m/ id="([^"]+)"/g;
s{<<elements>>}{$elements}g;

s{<<([^<>]*?[.]js)>>}{
  slurp $1
}ge;

my $R = sprintf '[%s]', join ',', qw[ h ];  # global fns defined in JS that are called from HTML

s{<script>(.*?)</script>}{
  my ($fh, $filename) = tempfile UNLINK => 1;
  binmode $fh, ':encoding(UTF-8)';
  print { $fh } $1;
  close $fh;
  #
  sprintf '<script>%s</script>',
  scalar qx[ deno run --quiet --allow-read npm:uglify-js --compress top_retain=$R,passes=5 --mangle toplevel,reserved=$R $filename ]
  # scalar qx[ deno run --quiet --allow-read npm:uglify-js $filename ]
  # scalar qx[ cat $filename ]
    =~ s/[;\s]+\Z//r
}sge;


## QUIZ SELECTION HTML

sub quiz_button { my ($quiz, $title) = @_;
  return qq[<nobr><button onclick="h('q=$quiz')">$title</button></nobr>];
  # <nobr> to treate that element as a normal text word for line-breaking, so it won't break `</nobr>.`
}

my $qs = (
  'اختبار معرفة '.quiz_button(gs => 'الآية البادئة بكلمة فريدة').' في القرءان،<br>'.
  'أو اختبار معرفة '.quiz_button(gg => 'الآية المحتوية على كلمة فريدة').' في القرءان.<br>'.
  'اختبار معرفة الآية الوحيدة في القرءان البادئة بكلمات معينة'.' '.note('والتي قد ترد في آيات أخرى في غير بداية الآية').':&emsp;'.
  quiz_button(s1 => 'كلمة واحدة '.note('صعب')).'،&emsp;'.
  quiz_button(s2 => 'كلمتين').'،&emsp;'.
  quiz_button(s3 => 'ثلاث').'،&emsp;'.
  quiz_button(s4 => 'أربع').'،&emsp;'.
  quiz_button(s5 => 'خمس').'،&emsp;'.
  quiz_button(s6 => 'ست').'،&emsp;'.
  quiz_button(s7 => 'سبع').'،&emsp;'.
  quiz_button(s8 => 'ثماني').'،&emsp;'.
  quiz_button(s9 => 'تسع كلمات '.note('سهل جدا')).'.<br>'.
  note('في جميع هذه الاختبارات، تُهمل حركة الحرف الأخير من الكلمة أو الكلمات.').
'');

s{<<qs>>}{$qs}g;


## SUAR SELECTION HTML

my $ss = '';  # TODO: for now, all suar are selected

s{<<ss>>}{$ss}g;


## END

print;
