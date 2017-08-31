import angular from 'angular';

/**
 * TODO 002a feof 20e3 [*] не срабатывает :(
 */
class OutCtrl {
  constructor($sce, Emoji) {
    this.$emoji = Emoji;
    this.$sce = $sce;

    /**
     * @type {RegExp}
     */
    // emojiRegEx: /((?:[\uFE0F\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|[0-9]\u20e3|[\u200C\u200D])+)/g,
    // this.emojiRegEx = /((?:[\uFE0F\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u2620\u2639\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|\uD83E\uDD38|\uD83E\uDD44|[0-9]\u20e3|[\u200C\u200D])+)/g;
    this.emojiRegEx = /([\u0023\u002a\u0030-\u0039]\ufe0f?\u20e3|\u00a9|\u00ae|[\u2000-\u204f\u20e0-\u20ef\u2120-\u213f\u2190-\u21af\u2310-\u232f\u23c0-\u23ff\u24c0-\u24cf\u25a0-\u27bf\u2930-\u293f\u2b00-\u2b1f\u2b50-\u2b5f\u3030-\u303f\u3290-\u329f\ud830-\ud83f\udc00-\udfff\ufe0f])+/g;
    // this.emojiRegEx = /([\u0023\u002a\u0030-\u0039]\ufe0f?\u20e3|\u00a9|\u00ae)+/g;
  }

  /**
   * 0030-20e3 - 0039-20e3
   * 0023-20e3
   * 002a-20e3
   * 00a9
   * 00ae
   *
   */


  /**
   * Возвращает тег для смайла
   * @param  {String} code   Код символа
   * @param  {String} symbol Сам символ
   * @param  {Boolean} toImg Преобразовывать в тег IMG (иначе - в I)
   * @return {String}        HTML код картинки
   */
  getHtmlTagForEmoji(code, symbol, toImg) {
    let pos = this.$emoji.getBgPosByUtf16(code, symbol);
    if (!pos)
      return console.warn(`Emoji ${code} not exists`);

    if (toImg)
      return `<img class="emoji" style="background-position: ${pos}">`;
    else
      return `<i class="emoji" style="background-position: ${pos}">&nbsp;</i>`;
  }

  /**
   * Подбирает коды к найденным символам
   * @param  {String} text Символ для замены
   * @param  {Boolean} toImg Преобразовывать в тег IMG (иначе - в I)
   */
  emojiReplace(text, toImg) {
    // console.log('#input: ', text);

    /// Превращаю строку в обычный массив символов
    let sym = [];
    for (let i = 0; i < text.length; i++)
      sym[i] = text[i];

    /// Перебираю все символы
    for (let pos = 0; ; pos++) {
      if (pos >= sym.length) break;
      // console.log(`*** ${pos}`, sym.slice(pos, pos + 5));

      let maxlen = -1;
      let found = '';
      for (let i = 0; i < 20; i++) {
        let code = sym.slice(pos, pos + i);
        code = sym.slice(pos, pos + i).map((item) => item.charCodeAt().toString(16).padStart(4, '0')).join('');
        // console.log(code);
        if (code in this.$emoji.utf16) {
          maxlen = i;
          found = code;
          // console.log('****** found', pos, maxlen, code);
        }
      }

      // console.log('result', pos, maxlen, found, sym);
      if (maxlen !== -1) {
        // console.log(found, this.getHtmlTagForEmoji(found));
        // console.log('#before:', sym);
        sym.splice(pos, maxlen, this.getHtmlTagForEmoji(found))
        // console.log('#after :', sym);
      }
      // console.log('#result:', sym);
      // console.log(getCode(0), getCode(1), sym);
    }

    return sym.join('');
  }

  /**
   * Преобразует символы смайликов в строке в соотведствующие изображения
   * @param  {String} str Строка для преобразования
   * @param  {Boolean} toImg Преобразовывать в тег IMG (иначе - в I)
   * @return {String}     Изменённая строка
   */
  replaceEmojis(text, toImg) {
    if (!text) return '';
    console.log('************************************');
    console.log('************************************');
    console.log('************************************');
    console.log(text);

    return text.replace(this.emojiRegEx, (v) => this.emojiReplace(v, toImg)).replace(/\uFE0F/g, '');
    // return this.emojiReplace(text, toImg).replace(/\uFE0F/g, '');
  }

  /**
   * Заменят символы & < > и перенос строки на соответствующие html сущности
   * @param text
   * @returns {string}
   */
  replaceSymbols(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br />');
  }

  /**
   * Возвращает полностью обработанную строку
   * @param text
   * @param  {Boolean} toImg Преобразовывать в тег IMG (иначе - в I)
   * @returns {*}
   */
  pretty(text, toImg) {
    text = this.replaceSymbols(text);
    text = this.replaceEmojis(text, toImg);
    return text;
  }

  set value(value) {
    this._value = value;
    this.html = this.$sce.trustAsHtml(this.pretty(value));
  }

  get value() {
    return this._value;
  }
}

export default angular.module('arswarog.emoji.out', [])
  .component('prettyText', {
    bindings: {
      value: '=ngModel',
      test: '<'
    },
    controller: OutCtrl,
    template: '<ng-bind-html ng-bind-html="$ctrl.html"></ng-bind-html>'
  })
  .name;