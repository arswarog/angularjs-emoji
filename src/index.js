import angular from 'angular';
import data from '../lib/data';
import container from './container';
import input from './input';
import out from './out';

class EmojiService {
  constructor() {
    this.data = data;
    this.categories = ['Recent'];
    this.recent = [];
    this.index = {};

    for (let i in this.data) {
      this.categories.push(i);
      this.data[i].forEach(item => {
        this.index[item.unified] = item;
      });
    }
  }

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

  saveRecent() {
    let emojis = this.recent.map(item => item.short);
    if (emojis.length > 100) emojis.length = 100;
    localStorage.setItem('recentEmoji', emojis.join(','));
  }

  addRecentEmoji(emoji) {
    this.recent.forEach((item, index) => {
      if (item.short === emoji.short)
        this.recent.splice(index, 1);
    });
    this.recent.unshift(emoji);
    this.saveRecent();
  }

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

export default angular.module('arswarog.emoji.service', [container, input, out])
  .service('Emoji', EmojiService)
  .name;