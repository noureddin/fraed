#!/bin/bash

declare out
declare -a dep

wanted() {
  if ! [ -e "$out" ]; then return 0; fi
  for f in "${dep[@]}"; do
    if [ "$f" -nt "$out" ]; then return 0; fi
  done
  return 1
}

if [ "$1" = "-B" ] || [ "$1" = force ] || [ "$1" = clean ]; then
  echo cleaning
  grep ^out= "${BASH_SOURCE[0]}" | sed s,^out=,, | while read line; do rm -f "$line"; done
  if [ "$1" = clean ]; then exit 0; fi
fi

out=.w.txt
dep=(.a.js .utils.js .writewords.js)
if wanted; then
  echo building $out
  cat "${dep[@]}" | deno run - > $out
fi

out=.p.txt
dep=(.a.js .utils.js .calcuniqprefix.js)
if wanted; then
  echo building $out
  cat "${dep[@]}" | deno run - > $out
fi

out=a.gz
dep=(.a.txt .w.txt .p.txt)
if wanted; then
  echo building $out
  cat "${dep[@]}" | perl -ne '/[0-9]/ ? ($ans .= $_) : print; END { print $ans }' | gzip --best > $out
  # that perl is to collect answers at the end for better compression (-22K)
fi

out=.g.js
dep=(.g.ts .g.sh)
if wanted; then
  echo building $out
  bash .g.sh
fi

out=index.html
dep=(a.gz .g.js .g.js .utils.js .init.js .make.js .logic.js .style.css .index.html .process.pl)
if wanted; then
  echo building $out
  perl -CDAS .process.pl .index.html > index.html
fi

