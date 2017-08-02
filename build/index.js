var request = require('request');
var fs = require('fs');
let data = {};
let src = 'https://unpkg.com/emoji-datasource-apple@3.0.0/img/apple/sheets/64.png';
let size = 16;

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

request(src).pipe(
  fs.createWriteStream(process.cwd() + "/images/emoji.png")
);

function convertHexToString(input) {

  let output = String.fromCodePoint(parseInt(input, 16));// + String.fromCharCode(parseInt(input, 16) % 65536);

  // console.log(parseInt(input, 16), `${input} => ${output}`);

  return output;
}

request.get('https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji_pretty.json', (error, resp, body) => {
  data = JSON.parse(body);
  let inlen = ("export default " + JSON.stringify(data)).length;

  let outdata = {};

  let _cats = {
    People: 1,
    Nature: 2,
    Foods: 3,
    Activity: 4,
    Places: 5,
    Objects: 6,
    Symbols: 7,
    Flags: 8,
  };

  function catId(item) {
    if (item.category in _cats)
      return _cats[item.category];

    let nextId = 1;
    for (i in _cats) nextId++;

    _cats[item.category] = nextId;

    return nextId;
  }

  data.sort((a, b) => {
    let acat = catId(a);
    let bcat = catId(b);
    return acat * 10000 + a.sort_order - bcat * 10000 - b.sort_order;
  });

  let skins = [
    '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF',
  ];


  asd:
    for (let i in data) {
      let item = {
        utf: convertHexToString(data[i].unified),
        category: data[i].category,
        name: data[i].name,
        unified: data[i].unified,
        variations: data[i].variations,
        short: data[i].short_name,
        shorts: data[i].short_names,
        text: data[i].text,
        texts: data[i].texts,
      };

      if ('skin_variations' in data[i]) {
        item.skins = true;
      }

      if (data[i].skin_variations) {
        let str = '';

        let count = 0;

        for (let j in item.skin_variations) {
          count++;

          let parts = item.unified.split('-');

          // console.log(parts);

          if (skins.indexOf(j) == -1)
            console.log('*********error');

          if (parts[1] === 'FE0F')
            parts.splice(1, 1, j);
          else
            parts.splice(1, 0, j);

          // console.log(parts);


          let tryuni = parts.join('-');

          // console.log(item.unified);
          // console.log(item.skin_variations[j].unified);
          // console.log(tryuni);
          // console.log('--2', j, tryuni === item.skin_variations[j].unified ? 'ok' : '************fail');


          if (tryuni !== item.skin_variations[j].unified) break asd;

          str += item.skin_variations[j].unified + ' ';
        }
        // console.log(count, item.unified, str);
        // break;
      }

      let x = Math.round(100000 / 48 * data[i].sheet_x) / 1000;
      let y = Math.round(100000 / 48 * data[i].sheet_y) / 1000;
      let pos = `${x}% ${y}%`;

      categories[item.category] = categories[item.category] ? categories[item.category] + 1 : 1;
      css += `.emoji.emoji-${item.short} { background-position: ${pos}; }\n`;
      css += `.emoji.emoji-${item.unified} { background-position: ${pos}; }\n`;

      delete item.sort_order;
      delete item.sheet_x;
      delete item.sheet_y;

      if (item.category !== 'Skin Tones') {
        if (!(item.category in outdata))
          outdata[item.category] = [];

        outdata[item.category].push(item);
        // outdata.push(item);
        // console.log(outdata[item.category]);
      }
    }

  var path = process.cwd() + "/lib/emoji.css";
  console.log(path);
  fs.writeFile(path, css, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  for (let i in data) {
    let item = data[i];
  }
  console.log(categories);

  let outdatafile = "export default " + JSON.stringify(outdata);

  fs.writeFile(process.cwd() + "/lib/data.js", outdatafile);

  console.log('Minify');
  let outlen = outdatafile.length;
  console.log(`from ${inlen} to ${outlen}`);
  console.log(Math.round(outlen * 100 / inlen) + '%');
})
;
