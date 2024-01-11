perl -CDAS -mutf8 -wpe '
    BEGIN { print "const A=[" }
    END { print "]" }
    # fix https://github.com/aliftype/quran-data/issues/17
    s/\b(\N{ARABIC LETTER ALEF WITH HAMZA ABOVE}\N{ARABIC FATHA}\N{ARABIC LETTER WAW}\N{ARABIC FATHA}) /$1/g;
    s/#//;  # remove first-aayah-in-sura marker
    s/^/"/; s/\n/",/;
' "$PROJECTS_ROOT/recite/res/.othmani.txt" | sed 's/,\]/]/' > a.js
