// TODO 2. isMax
// TODO 3. tests

let Builder = require('./builder');

let request = require('request');
let fs = require('fs');
let data = {};
let src = 'https://unpkg.com/emoji-datasource-apple@3.0.0/img/apple/sheets/64.png';
let size = 16;
let codes = {};
let builder = null;

let categories = {};

let css = fs.readFileSync('./src/emoji.css', 'utf8');

css += `.emoji {
  width: 20px;
  height: 20px;
  display: inline-block;
  contenteditable: false;
  background-size: 4900%;
  background-image: url('../images/emoji.png');
  background-repeat: no-repeat;
  margin: -2px 2px 0 2px;
  padding-bottom: -5px;
  vertical-align: middle;
  text-indent: -9999px;
  border: 0;
}
.emoji.emoji16 {
  width: 16px;
  height: 16px;
}
.emoji.emoji24 {
  width: 24px;
  height: 24px;
}
`;

// request(src).pipe(
  // fs.createWriteStream(process.cwd() + "/images/emoji.png")
// );

request.get('https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji_pretty.json', (error, resp, body) => {
  data = JSON.parse(body);

  builder = new Builder(data);

  let inlen = ("export default " + JSON.stringify(data)).length;

  let skins = [
    '1f3fb', '1f3fc', '1f3fd', '1f3fe', '1f3ff',
  ];

  let outdata = builder.makeData();

  var path = process.cwd() + "/lib/emoji.css";

  console.log(path);
  fs.writeFile(path, css + builder.makeCss(outdata, true, true), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  for (let i in data) {
    let item = data[i];
  }
  console.log(builder.categories);

  let outdatafile = "export default " + JSON.stringify(outdata);

  fs.writeFile(process.cwd() + "/lib/data.js", outdatafile);

  console.log('Minify');
  let outlen = outdatafile.length;
  console.log(`from ${inlen} to ${outlen}`);
  console.log(Math.round(outlen * 100 / inlen) + '%');

  let codelist = [];
  for (let key in codes) codelist.push(key);

  codelist = codelist.sort((a, b) => parseInt(a, 16) - parseInt(b, 16));

  // console.log(codelist);

  let regexp = [];

  let ranges = [];
  let lastcode = false;
  let start = codelist[0];
  for (let code of codelist) {
    // console.log('last %s, cur %s', lastcode.toString(16), code);
    if (lastcode !== false) {
      if (parseInt(code, 16) > lastcode + 3) {
        console.log('range %s - %s', start, lastcode.toString(16), (lastcode - parseInt(start, 16) + 1));
        regexp.push("\\" + "u" + start + '0-\\' + 'u' + lastcode.toString(16) + 'f');
        start = code;
      } else {
        // console.log('is next');
      }
    }
    lastcode = parseInt(code, 16);
  }
  // regexp.push("\\"+"u"+start+'0-\\'+'u'+lastcode.toString(16)+'f');
  regexp.push("\\ufe0f");
  console.log('range %s - %s', start, lastcode.toString(16), (lastcode - parseInt(start, 16) + 1));

  console.log('regexp: ', regexp.join(''));
})
