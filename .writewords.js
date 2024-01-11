// W = A | unmark | split ' ' | deirab | only_uniq
// WA[i] is where A[i] includes the word W[i]
const _ = A
  .flatMap((aya, idx) => unmark(aya).split(' ').map(word => [word, idx]))
  .map(pair => [deirab(pair[0]), pair[1]])
const W = 
  only_uniq(_.map(pair => pair[0]))
  // only_uniq(A.flatMap((aya, idx) => unmark(aya).split(' ')).map(deirab))
const WA =
  W.map(word => _.find(pair => pair[0] === word)[1])

await write_array_to_file('w', W.map(w => '"' + w + '"'))  // strings (words)

await write_array_to_file('wa', WA)  // numbers (indices)

// Creating this takes too long in JS, even with Deno.
// So it's better to precompute it and ship that ~220 KB of data (for w.js).
// (For comparison, the data in a.js is ~1,400 KB.)
// It's not written in Perl (it was), to have a single source of truth.

async function write_array_to_file (name, array_raw) {
  // https://examples.deno.land/streaming-files

  const output = await Deno.open(name.toLowerCase() + '.js', {
    write: true,
    create: true,
  })

  const outputWriter = output.writable.getWriter()
  await outputWriter.ready

  const outputText =
    'const ' + name.toUpperCase() + '=[' + array_raw.join(',') + ']'
  const encoded = new TextEncoder().encode(outputText)
  await outputWriter.write(encoded)

  await outputWriter.close()
}

