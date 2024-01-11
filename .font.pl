#!/usr/bin/env perl
use v5.16; use warnings; use autodie; use utf8;
use open qw[ :encoding(UTF-8) :std ];
use List::Util qw[ uniqnum ];
sub slurp(_) { local $/; open my $f, '<', $_[0]; return scalar <$f> }

my $UNICODE_RANGE = join ',',
  map { sprintf 'U+%X', $_ }
  sort { $a <=> $b } uniqnum map { ord }
# all characters used in the Quran text:
  (grep /[^\[\]=a-zA-Z",]/, split '', slurp('a.js')),
# plus the following for the UI text:
  (split '', '().،:؟يآ[]'),
;

system qw[ pyftsubset .AmiriQuran.ttf --output-file=q.woff  --layout-features=* --flavor=woff  ], '--unicodes='.$UNICODE_RANGE, '--with-zopfli';
system qw[ pyftsubset .AmiriQuran.ttf --output-file=q.woff2 --layout-features=* --flavor=woff2 ], '--unicodes='.$UNICODE_RANGE;

