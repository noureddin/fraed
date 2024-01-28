index.html: a.gz .g.js .*.js .style.css .index.html .process.pl
	perl -CDAS .process.pl .index.html > index.html

.w.txt: .a.js .utils.js .writewords.js
	cat $^ | deno run - > $@

.p.txt: .a.js .utils.js .calcuniqprefix.js
	cat $^ | deno run - > $@

.g.js: .g.ts .g.sh
	bash .g.sh
