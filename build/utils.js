
function convertHexToString(input) {
  console.log(' < ', input, input.match(/((.{4})+?|(.{1,4})$)/g));
  let output = input
    .match(/((.{4})+?|(.{1,4})$)/g)
    .map((part) => String.fromCodePoint(parseInt(part, 16)))
    .join('');
  console.log(' > ', output);
  // console.log(parseInt(input, 16), `${input} => ${output}`);
  return output;
}