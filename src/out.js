import angular from 'angular';

/**
 * TODO 002a feof 20e3 [*] не срабатывает :(
 */
class OutCtrl {
  constructor($sce, Emoji) {
    this.$emoji = Emoji;
    this.$sce = $sce;
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
    text = this.$emoji.replaceEmojis(text, toImg);
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