import angular from 'angular';
import data from '../lib/data';

class EmojiService {
  constructor() {
    this.data = data;
    this.categories = ['Recent'];
    this.recent = [];
    this.index = {};
    this.utf16 = {};

    for (let i in this.data) {
      this.categories.push(i);
      this.data[i].forEach(item => {
        this.index[item.unified] = item;
        this.utf16[item.utf16] = item;
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
   * Возвращает background-position по utf16 доку символа
   * @param  {String} code   Код символа
   * @param  {String} symbol Сам символ
   * @return {String}        HTML код картинки
   */
  getBgPosByUtf16(code, symbol) {
    let info = this.utf16[code];
    if (!info)
      return false;//console.warn(`Emoji ${code} not exists`);

    let x = Math.round(100000 / 48 * info.x) / 1000;
    let y = Math.round(100000 / 48 * info.y) / 1000;
    return `${x}% ${y}%`;
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
}

export default angular.module('arswarog.emoji.service', [])
  .service('Emoji', EmojiService)
  .name;