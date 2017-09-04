import angular from 'angular';
import data from '../lib/data';

class EmojiService {
  constructor() {
    this.data = data;
    this.categories = ['Recent'];
    this.recent = [];
    this.index = {};
    this.utf16 = {};
    this.colors = ['d83cdffb', 'd83cdffc', 'd83cdffd', 'd83cdffe', 'd83cdfff'];
    this._container = null;

    /**
     * @type {RegExp}
     */
    // emojiRegEx: /((?:[\uFE0F\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|[0-9]\u20e3|[\u200C\u200D])+)/g,
    // this.emojiRegEx = /((?:[\uFE0F\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u2620\u2639\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|\uD83E\uDD38|\uD83E\uDD44|[0-9]\u20e3|[\u200C\u200D])+)/g;
    this.emojiRegEx = /([\u0023\u002a\u0030-\u0039]\ufe0f?\u20e3|\u00a9|\u00ae|[\u2000-\u204f\u20e0-\u20ef\u2120-\u213f\u2190-\u21af\u2310-\u232f\u23c0-\u23ff\u24c0-\u24cf\u25a0-\u27bf\u2930-\u293f\u2b00-\u2b1f\u2b50-\u2b5f\u3030-\u303f\u3290-\u329f\ud830-\ud83f\udc00-\udfff\ufe0f])+/g;
    // this.emojiRegEx = /([\u0023\u002a\u0030-\u0039]\ufe0f?\u20e3|\u00a9|\u00ae)+/g;

    for (let i in this.data) {
      this.categories.push(i);
      this.data[i].forEach(item => {
        this.index[item.unified] = item;
        item.utf16.forEach(utf16 => this.utf16[utf16] = item);
      });
    }
  }

  /**
   * Получение и формирования списк последних использованных смайлов
   * @param count Количество
   * @returns {Array}
   */
  getRecent(count) {
    if (!count) count = 54;
    console.log('get recent %s', count);

    let recent = localStorage.getItem('recentEmoji');
    if (recent) {
      recent = recent.split(',');
      let data = recent.map(emoji => {
        for (let name in this.data) {
          let cat = this.data[name];
          let res = cat.find(item => item.short === emoji);
          if (res) return res;
        }
      });

      this.recent = data;
    } else this.recent = [];

    let data = [];
    for (let i = 0; i < count; i++)
      if (this.recent[i])
        data.push(this.recent[i]);
      else
        break;

    if (data.length < count)
      for (let i = 0; data.length < count; i++)
        if (data.indexOf(this.data.People[i]) === -1)
          data.push(this.data.People[i]);

    return data;
  }

  /**
   * Сохранение списка последних используемых смайлов в localStorage
   */
  saveRecent() {
    let emojis = this.recent.map(item => item.short);
    if (emojis.length > 100) emojis.length = 100;
    localStorage.setItem('recentEmoji', emojis.join(','));
  }

  /**
   * Добавления смайла в списк последних использованных
   * @param emoji
   */
  addRecentEmoji(emoji) {
    this.recent.forEach((item, index) => {
      if (item.short === emoji.short)
        this.recent.splice(index, 1);
    });
    this.recent.unshift(emoji);
    this.saveRecent();
  }

  /**
   * Получения списка смайлов в категории по названию или номеру.
   *
   * По 0 возвращаются последние использованные смайлы
   * @param name|number Категория
   * @returns {*}
   */
  getCategory(name) {
    if (!name)
      name = 0;

    if (typeof name === 'number' && this.categories[name])
      name = this.categories[name];

    if (name === 'Recent')
      return this.getRecent();

    if (!this.data[name])
      throw new Error("error emoji category " + name);

    return this.data[name];
  }

  set container(container) {
    this._container = container;
  }

  get container() {
    return this._container;
  }

  showContainer(callback, element, orientation) {
    this._container.showContainer((e) => callback(e), element, orientation);
  }

  cancelContainer() {
    this._container.cancelContainer();
  }

  /**
   * Преобразует символы смайликов в строке в соответствующие изображения
   * @param  {String} str Строка для преобразования
   * @param  {Boolean} toImg Преобразовывать в тег IMG (иначе - в I)
   * @return {String}     Изменённая строка
   */
  replaceEmojis(text, toImg) {
    if (!text) return '';
    console.log('************************************');
    console.log(text);

    // return text.replace(this.emojiRegEx, (v) => this.emojiReplace(v, toImg)).replace(/\uFE0F/g, '');
    return this.emojiReplace(text, toImg).replace(/\uFE0F/g, '');
  }

  /**
   * Подбирает коды к найденным последовательностям
   * @param  {String} text Символ для замены
   * @param  {Boolean} toImg Преобразовывать в тег IMG (иначе - в I)
   */
  emojiReplace(text, toImg) {
    /// Превращаю строку в обычный массив символов
    let sym = [];
    for (let i = 0; i < text.length; i++)
      sym[i] = text[i];

    /// Перебираю все символы
    for (let pos = 0; ; pos++) {
      if (pos >= sym.length) break;

      let info = '';

      let maxlen = -1;
      let found = '';
      let color = 0;
      for (let i = 0; i < 20; i++) {
        let code = sym.slice(pos, pos + i);
        code = sym.slice(pos, pos + i).map((item) => item.charCodeAt().toString(16).padStart(4, '0')).join('');

        if (code in this.utf16) {
          maxlen = i;
          found = code;
          info = this.utf16[code];
        } else if (i === maxlen + 2) {
          color = this.colors.indexOf(code.substr(-8)) + 1;
          if (color) {
            maxlen = i;
            found = code;
            break;
          }
        }
      }

      if (maxlen !== -1) {
        // console.log(found, this.getHtmlTagForEmoji(found));
        // console.log('#before:', sym);
        sym.splice(pos, maxlen, this.getHtmlTagForEmoji(info, color, toImg));
        // console.log('#after :', sym);
      }
    }
    return sym.join('');
  }

  /**
   * Возвращает тег для смайла
   * @param  {String} code   Код символа
   * @param  {String} symbol Сам символ
   * @param  {Boolean} toImg Преобразовывать в тег IMG (иначе - в I)
   * @return {String}        HTML код картинки
   */
  getHtmlTagForEmoji(emoji, color, toImg) {
    let pos = this.getBgPosByUtf16(emoji, color);
    if (!pos)
      return console.warn(`Emoji ${code} not exists`);

    let utf = emoji.utf;
    if (color)
      utf += ['', '\ud83c\udffb', '\ud83c\udffc', '\ud83c\udffd', '\ud83c\udffe', '\ud83c\udfff'][color];
    // let info = this.utf16[code];

    if (toImg)
      return `<img class="emoji" data-emoji="${utf}" style="background-position: ${pos}">`;
    else
      return `<i class="emoji" data-emoji="${utf}" style="background-position: ${pos}">&nbsp;</i>`;
  }

  /**
   * Возвращает background-position по utf16 доку символа
   * @param  {String} code   Код символа
   * @param  {String} symbol Сам символ
   * @return {String}        HTML код картинки
   */
  getBgPosByUtf16(emoji, delta) {
    if (!delta) delta = 0;
    // let info = this.utf16[code];
    // if (!info) {
    //   let color = this.colors.indexOf(code.substr(-8)) + 1;
    //   if (!color) return false;
    //   code = code.substr(0, code.length - 8);
    //   info = this.utf16[code];
    //   if (info)
    //     delta = color;
    //   else
    //     return false;//console.warn(`Emoji ${code} not exists`);
    // }

    let pid = emoji.pid + delta;
    let x = Math.floor(pid / 49);
    let y = pid % 49;

    let px = Math.round(100000 / 48 * x) / 1000;
    let py = Math.round(100000 / 48 * y) / 1000;
    return `${px}% ${py}%`;
  }
}

export default angular.module('arswarog.emoji.service', [])
  .service('Emoji', EmojiService)
  .name;