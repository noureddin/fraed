index.html: a.gz .g.js .*.js .style.css .index.html .process.pl
	perl -CDAS .process.pl .index.html > index.html

.w.txt: .a.js .utils.js .writewords.js
	cat $^ | deno run - > $@

.p.txt: .a.js .utils.js .calcuniqprefix.js
	cat $^ | deno run - > $@

a.gz: .a.txt .w.txt .p.txt
        cat $^ | perl -ne '/[0-9]/ ? ($$ans .= $$_) : print; END { print $$ans }' | gzip --best > $@
# that perl is to collect answers at the end for better compression (-22K)

.g.js: .g.ts .g.sh
	bash .g.sh
