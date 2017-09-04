module.exports = class Builder {
  /**
   *
   * @param database https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji_pretty.json
   */
  constructor(database, categories) {
    this.database = database;
    this.outData = {};
    this.usedCodes = {};
    this.categories = {};
    this.catlist = {
      People: 1,
      Nature: 2,
      Foods: 3,
      Activity: 4,
      Places: 5,
      Objects: 6,
      Symbols: 7,
      Flags: 8,
    };

    this.database.sort((a, b) => {
      let acat = this.categoryId(a);
      let bcat = this.categoryId(b);
      return acat * 10000 + a.sort_order - bcat * 10000 - b.sort_order;
    });
  }

  bgPositionBy(x, y) {
    let rx = Math.round(100000 / 48 * x) / 1000;
    let ry = Math.round(100000 / 48 * y) / 1000;
    return `${rx}% ${ry}%`;
  }

  makeData() {
    this.database.forEach(data => {
      let item = {
        category: data.category,
        name: data.name,
        unified: data.unified.toLowerCase(),
        variations: data.variations,
        short: data.short_name.toLowerCase(),
        shorts: data.short_names,
        text: data.text,
        texts: data.texts,
        x: data.sheet_x,
        y: data.sheet_y,
        pid: data.sheet_x * 49 + data.sheet_y,
      };

      if (data.sheet_y >= 49) throw new Error('Rows more 49!');

      let utf16 = this.toUtf16(item.unified);

      // console.log(item.unified, utf16);

      item.utf16 = [utf16];
      item.utf = this.convertHexToString(item.utf16[0]);
      item.variations.forEach(unified => item.utf16.push(this.toUtf16(unified)));
      // console.log(item.utf16);

      if ('skin_variations' in data) {
        item.skins = true;
      }

      // if (0 && data.skin_variations) {
      //   let str = '';
      //
      //   let count = 0;
      //
      //   for (let j in item.skin_variations) {
      //     count++;
      //
      //     let parts = item.unified.split('-');
      //
      //     // console.log(parts);
      //
      //     if (skins.indexOf(j) == -1)
      //       console.log('*********error');
      //
      //     if (parts[1] === 'FE0F')
      //       parts.splice(1, 1, j);
      //     else
      //       parts.splice(1, 0, j);
      //
      //     // console.log(parts);
      //
      //
      //     let tryuni = parts.join('-');
      //
      //     // console.log(item.unified);
      //     // console.log(item.skin_variations[j].unified);
      //     // console.log(tryuni);
      //     // console.log('--2', j, tryuni === item.skin_variations[j].unified ? 'ok' : '************fail');
      //
      //
      //     if (tryuni !== item.skin_variations[j].unified) break asd;
      //
      //     str += item.skin_variations[j].unified + ' ';
      //   }
      //   // console.log(count, item.unified, str);
      //   // break;
      // }


      // item.pos = this.bgPositionBy(item.x, item.y);

      this.categories[item.category] = this.categories[item.category] ? this.categories[item.category] + 1 : 1;

      if (item.category !== 'Skin Tones') {
        if (!(item.category in this.outData))
          this.outData[item.category] = [];

        this.outData[item.category].push(item);
        // this.outData.push(item);
        // console.log(this.outData[item.category]);
      }
    });
    return this.outData;
  }

  /**
   * Make css by outdata
   * @param data Input data
   * @param short Create smiles by short name
   * @param unified Create smiles by unified code
   * @returns {string}
   */
  makeCss(data, short, unified) {
    let css = '';
    for (let catname in data) {
      data[catname].forEach(item => {
        if (short)
          css += `.emoji.emoji-${item.short} { background-position: ${this.bgPositionBy(item.x, item.y)}; }\n`;
        if (unified)
          css += `.emoji.emoji-${item.unified} { background-position: ${this.bgPositionBy(item.x, item.y)}; }\n`;
      })
    }
    return css;
  }

  /**
   * Category id by emoji item
   * @param item Emoji
   * @returns number
   */
  categoryId(item) {
    if (item.category in this.catlist)
      return this.catlist[item.category];

    let nextId = 1;
    for (let i in this.catlist) nextId++;

    this.catlist[item.category] = nextId;

    return nextId;
  }

  convertHexToString(input) {
    // console.log(' < ', input, input.match(/((.{4})+?|(.{1,4})$)/g));
    let output = input
      .match(/((.{4})+?|(.{1,4})$)/g)
      .map((part) => String.fromCodePoint(parseInt(part, 16)))
      .join('');
    // console.log(' > ', output);
    // console.log(parseInt(input, 16), `${input} => ${output}`);
    return output;
  }

  toUtf16(unified) {
    let utf16 = '';
    unified.split('-').forEach(code => {
      let num = parseInt(code, 16);

      if (num < 0x10000) {
        utf16 += code;
        this.usedCodes[code.substr(0, 3)] = 1;
      } else if (num < 0x80000) {
        utf16 += (0xD800 + ((num & 0xffc00 - 0x10000) >>> 10)).toString(16).toLowerCase();
        utf16 += (0xDC00 + (num & 0x3ff)).toString(16).toLowerCase();
        this.usedCodes[(0xD800 + ((num & 0xffc00 - 0x10000) >>> 10)).toString(16).toLowerCase().substr(0, 3)] = 1;
        this.usedCodes[(0xDC00 + (num & 0x3ff)).toString(16).toLowerCase().substr(0, 3)] = 1;
      }
      else throw new Error(`Can not encode "${code}" to 6-bytes utf16`);
    });
    return utf16.toLowerCase();
  }
}