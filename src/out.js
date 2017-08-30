import angular from 'angular';

class OutCtrl {
  constructor($sce, Emoji) {
    this.$emoji = Emoji;
    this.$sce = $sce;
    /**
     * @type {RegExp}
     */
    this.emojiCharSeq = /[0-9\uD83D\uD83C]/;
    /**
     * @type {RegExp}
     */
    // emojiRegEx: /((?:[\uFE0F\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|[0-9]\u20e3|[\u200C\u200D])+)/g,
    this.emojiRegEx = /((?:[\uFE0F\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|[0-9]\u20e3|[\u200C\u200D])+)/g;
  }

  $onInit() {
    if (this.test)
      this.selfTest();
  }

  selfTest() {
    console.warn('test');
  }

  encode(value) {
    let result = value
      .replace('&', '&amp;')
      .replace('<', '&lt;')
      .replace('>', '&gt;')
      .replace('\n', '<br />');
    result = this.emojiToHTML(result);
    return result;
  }

  /**
   * @param  {String} code   Код символа
   * @param  {String} symbol Сам символ
   * @return {String}        HTML код картинки
   */
  getEmojiHTML(code, symbol) {
    console.log(code, symbol);

    let info = this.$emoji.index[code];
    if (!info)
      return console.warn(`Emoji ${code} not exists`);

    let x = Math.round(100000 / 48 * info.x) / 1000;
    let y = Math.round(100000 / 48 * info.y) / 1000;
    let pos = `${x}% ${y}%`;

    return `<i class="emoji" style="background-position: ${pos}">&nbsp;</i>`;
    return '<img class="emoji" ' + (symbol ? 'alt="' + symbol + '"' : '') + ' src="' + this.pathToEmojisImages + code + '.png" />';
  }

  /**
   * Преобразует символы смайликов в строке в соотведствующие изображения
   * @param  {String} str Строка для преобразования
   * @return {String}     Изменённая строка
   */
  emojiToHTML(str) {
    console.log(str);
    const regs = {
      'D83DDE07': /(\s|^)([0OО]:\))([\s\.,]|$)/g,
      'D83DDE09': /(\s|^)(;-\)+)([\s\.,]|$)/g,
      'D83DDE06': /(\s|^)([XХxх]-?D)([\s\.,]|$)/g,
      'D83DDE0E': /(\s|^)(B-\))([\s\.,]|$)/g,
      'D83DDE0C': /(\s|^)(3-\))([\s\.,]|$)/g,
      'D83DDE20': /(\s|^)(&gt;\()([\s\.,]|$)/g,
      'D83DDE30': /(\s|^)(;[oоOО])([\s\.,]|$)/g,
      'D83DDE33': /(\s|^)(8\|)([\s\.,]|$)/g,
      'D83DDE32': /(\s|^)(8-?[oоOО])([\s\.,]|$)/g,
      'D83DDE0D': /(\s|^)(8-\))([\s\.,]|$)/g,
      'D83DDE37': /(\s|^)(:[XХ])([\s\.,]|$)/g,
      'D83DDE28': /(\s|^)(:[oоOО])([\s\.,]|$)/g,
      '2764': /(\s|^)(&lt;3)([\s\.,]|$)/g,
      'D83DDE0A': /(:-\))([\s\.,]|$)/g,
      'D83DDE03': /(:-D)([\s\.,]|$)/g,
      'D83DDE1C': /(;-[PР])([\s\.,]|$)/g,
      'D83DDE0B': /(:-[pр])([\s\.,]|$)/g,
      'D83DDE12': /(:-\()([\s\.,]|$)/g,
      '263A': /(:-?\])([\s\.,]|$)/g,
      'D83DDE0F': /(;-\])([\s\.,]|$)/g,
      'D83DDE14': /(3-?\()([\s\.,]|$)/g,
      'D83DDE22': /(:&#039;\()([\s\.,]|$)/g,
      'D83DDE2D': /(:_\()([\s\.,]|$)/g,
      'D83DDE29': /(:\(\()([\s\.,]|$)/g,
      //'D83DDE15': /(:\\)([\s\.,]|$)/g,
      'D83DDE10': /(:\|)([\s\.,]|$)/g,
      'D83DDE21': /(&gt;\(\()([\s\.,]|$)/g,
      'D83DDE1A': /(:-\*)([\s\.,]|$)/g,
      'D83DDE08': /(\}:\))([\s\.,]|$)/g,
      'D83DDC4D': /(:like:)([\s\.,]|$)/g,
      'D83DDC4E': /(:dislike:)([\s\.,]|$)/g,
      '261D': /(:up:)([\s\.,]|$)/g,
      '270C': /(:v:)([\s\.,]|$)/g,
      'D83DDC4C': /(:ok:|:ок:)([\s\.,]|$)/g
    };

    for (let code in regs) {
      str = str.replace(regs[code], this.getEmojiHTML(code));
    }

    return str.replace(this.emojiRegEx, (v) => this.emojiReplace(v)).replace(/\uFE0F/g, '');
  }

  /**
   * Подбирает коды к найденным символам
   * @param  {String} symbolstr Символ для замены
   */
  emojiReplace(symbolstr) {
    let buffer = '';
    let numbuffer = 0;
    let altBuffer = '';
    let joiner = false;
    let isFlag = false;
    let out = '';

    const symbols = [];
    const codes = [];

    console.log('symbolstr: ', symbolstr);
    for (let i = 0; i < symbolstr.length; i++) {
      const num = symbolstr.charCodeAt(i);
      const code = num.toString(16).toUpperCase();
      const symbol = symbolstr.charAt(i);

      console.log(num, code, ((num >> 8).toString(2)));

      if (i === 1 && num === 8419) {
        codes.push('003' + symbolstr.charAt(0) + '20e3');
        symbols.push(symbolstr.charAt(0));
        buffer = '';
        altBuffer = '';
        continue;
      }

      buffer += code;
      if (num & 0xd800) {
        if (num & 0x400) {
          // low surrogate
          if (numbuffer) {
            numbuffer = (numbuffer << 10) + (num - 0xdc00);
          }
        } else {
          // high surrogate
          numbuffer = num - 0xd800 + 0x40;
        }
      }
      altBuffer += symbol;
      if (!symbol.match(this.emojiCharSeq)) {
        console.log('buffer', buffer, numbuffer, (num & 0xd800).toString(2), numbuffer.toString(16));
        if (numbuffer)
          codes.push(numbuffer.toString(16));
        else
          codes.push(buffer.toLowerCase());

        symbols.push(altBuffer);
        buffer = '';
        numbuffer = 0;
        altBuffer = '';
      }
    }

    if (buffer) {
      codes.push(buffer.toLowerCase());
      symbols.push(altBuffer);
    }

    buffer = '';
    altBuffer = '';

    for (let i = 0; i < codes.length; ) {
      let maxlen = 0;
      for (let j = i+1; j <= codes.length; j++) {
        let line = codes.slice(i, j);
        console.log(line.join('-'));
        if (line.join('-') in this.$emoji.index) {
          maxlen = j-i;
          console.log('found', line.join('-'), maxlen);
        }
      }
      console.log(i, maxlen, codes.slice(i, i+maxlen));
      out += this.getEmojiHTML(codes.slice(i, i+maxlen).join('-'))
      i+=maxlen;
    }
    return out;
  }

  set value(value) {
    this._value = value;
    this.html = this.$sce.trustAsHtml(this.encode(value));
  }

  get value() {
    return this._value;
  }
}

export default angular.module('arswarog.emoji.out', [])
  .component('emojiOut', {
    bindings: {
      value: '=ngModel',
      test: '<'
    },
    controller: OutCtrl,
    template: '<ng-bind-html ng-bind-html="$ctrl.html"></ng-bind-html>'
  })
  .name;