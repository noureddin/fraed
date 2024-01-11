index.html: w.js wa.js .*.js .style.css .index.html .process.pl
	perl -CDAS .process.pl .index.html > index.html

w.js: a.js .utils.js .writewords.js
	rm w.js wa.js -f
	cat $^ | deno run --allow-write -

wa.js: w.js
	@

