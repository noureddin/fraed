# perl -CDAS -mutf8 -wpe '
#     ## fix https://github.com/aliftype/quran-data/issues/17
#     s/\b(\N{ARABIC LETTER ALEF WITH HAMZA ABOVE}\N{ARABIC FATHA}\N{ARABIC LETTER WAW}\N{ARABIC FATHA}) /$1/g;
#     s/#//;  ## remove first-aayah-in-sura marker
# ' "$PROJECTS_ROOT/recite/res/.othmani.txt" > .a.txt

# perl -CDAS -mutf8 -wpe '
#     BEGIN { print "const A=[" }
#     END { print "]\n" }
#     s/^/"/; s/\n/",/;
# ' .a.txt | sed 's/,\]/]/' > .a.js
