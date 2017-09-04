// TODO 2. isMax
// TODO 3. tests

let request = require('request');
let fs = require('fs');
let data = {};
let src = 'https://unpkg.com/emoji-datasource-apple@3.0.0/img/apple/sheets/64.png';
let size = 16;
let codes = {};

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

function toUtf16(unified) {
  let utf16 = '';
  unified.split('-').forEach(code => {
    let num = parseInt(code, 16);

    if (num < 0x10000) {
      utf16 += code;
      codes[code.substr(0, 3)] = 1;
    } else if (num < 0x80000) {
      utf16 += (0xD800 + ((num & 0xffc00 - 0x10000) >>> 10)).toString(16).toLowerCase();
      utf16 += (0xDC00 + (num & 0x3ff)).toString(16).toLowerCase();
      codes[(0xD800 + ((num & 0xffc00 - 0x10000) >>> 10)).toString(16).toLowerCase().substr(0, 3)] = 1;
      codes[(0xDC00 + (num & 0x3ff)).toString(16).toLowerCase().substr(0, 3)] = 1;
    }
    else throw new Error(`Can not encode "${code}" to 6-bytes utf16`);
  });
  return utf16;
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
    '1f3fb', '1f3fc', '1f3fd', '1f3fe', '1f3ff',
  ];

  asd:
    for (let i in data) {
      let item = {
        category: data[i].category,
        name: data[i].name,
        unified: data[i].unified.toLowerCase(),
        variations: data[i].variations,
        short: data[i].short_name.toLowerCase(),
        shorts: data[i].short_names,
        text: data[i].text,
        texts: data[i].texts,
        x: data[i].sheet_x,
        y: data[i].sheet_y,
      };

      let utf16 = toUtf16(item.unified);

      console.log(item.unified, utf16);

      item.utf16 = [utf16];
      item.utf = convertHexToString(item.utf16[0]);


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

      let x = Math.round(100000 / 48 * item.x) / 1000;
      let y = Math.round(100000 / 48 * item.y) / 1000;
      let pos = `${x}% ${y}%`;

      categories[item.category] = categories[item.category] ? categories[item.category] + 1 : 1;
      // css += `.emoji.emoji-${item.short} { background-position: ${pos}; }\n`;
      css += `.emoji.emoji-${item.unified} { background-position: ${pos}; }\n`;

      delete item.sort_order;

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

  let codelist = [];
  for (let key in codes) codelist.push(key);

  codelist = codelist.sort((a, b) => parseInt(a, 16) - parseInt(b, 16));

  console.log(codelist);

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
