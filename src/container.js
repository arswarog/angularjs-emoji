import angular from 'angular';
import perfect_scrollbar from 'perfect-scrollbar';

let template = `
<div
    v-show="smilesContainerIsShowed"
    id="emoji-container"
    class="emoji-container smile24"
    ref="container"
    onselectstart="return false;"
    onmousedown="return false;"
    ng-mouseover="onWidgetMouseOver()"
    ng-mouseout="onWidgetMouseOut()">
  <div class="smilesCollection" ref="collection">
    <div>
      <i ng-repeat="smile in smiles" class="emoji emoji-{{smile.unified}}" unselectable="on" ng-click="emojiClick(smile)"></i>
    </div>
  </div>
  <div class="collections" ng-mouseout="onCategoryMouseOut()">
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    ng-mouseover="onCategoryMouseOver(0)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 216px;" ng-mouseover="onCategoryMouseOver(1)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 192px;" ng-mouseover="onCategoryMouseOver(2)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 168px;" ng-mouseover="onCategoryMouseOver(3)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 144px;" ng-mouseover="onCategoryMouseOver(4)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 120px;" ng-mouseover="onCategoryMouseOver(5)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 96px;" ng-mouseover="onCategoryMouseOver(6)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 72px;" ng-mouseover="onCategoryMouseOver(7)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 48px;" ng-mouseover="onCategoryMouseOver(8)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 24px;" ng-mouseover="onSearchMouseOver()"></i>
  </div>
</div>`;

export default angular.module('arswarog.emoji.container', [])
  .directive('emojiContainer', class ContainerCtrl {
    constructor(Emoji, $timeout) {
      console.log('emoji', Emoji);
      // console.log('$timeout', $timeout);

      // for directive
      this.$emoji = Emoji;
      this.$timeout = $timeout;
      this.template = template;
      this.replace = true;
      this.restrict = 'AE';
      this.scope = {
        preview: '=preview',
      };

      // for work
      this.timer = false;
      this.$emoji.container = this;

      // controller
      this.controller = ($scope) => this.$onInit($scope);
    }

    link(scope, element, attributes, controller, transcludeFn) {
      this.container = element[0];
      this.collection = this.container.firstChild.nextSibling;
      console.log(this.collection)
    }

    $onInit($scope) {
      console.log('cccccontroller');
      this.$scope = $scope;

      this.$scope.smiles = this.$emoji.getCategory();

      $scope.emojiClick = (emoji) => this.emojiClick(emoji);
      $scope.onCategoryMouseOver = (cat) => this.onCategoryMouseOver(cat);
      $scope.onCategoryMouseOut = (cat) => this.onCategoryMouseOut(cat);

      setTimeout(() => {
        console.log(this.collection);
        perfect_scrollbar.initialize(this.collection, {
          wheelSpeed: 0.4,
          suppressScrollX: true,
        });
      }, 1);
    }

    showContainer(callback, element, orientation) {
      console.log('container: show');
      this.callback = callback;

      this.selectEmojiCategory(0);
      // this.container.style.display = 'block';
      // this.container.style.right = '20px';
      this.collection.scrollTop = 0;
      this.setPositionForContainer(element, orientation);
      this.widgetTimeoutId = setTimeout(() => this.close(), 300000000);

    }

    cancelContainer() {
      console.log('container: cancel');
    }

    emojiClick(emoji) {
      // this.$emoji.addRecentEmoji(emoji);
      this.callback(emoji);
      console.log(emoji);
    }

    onCategoryMouseOver(cat) {
      this.$timeout.cancel(this.timer);
      this.timer = this.$timeout(() => this.$scope.smiles = this.$emoji.getCategory(cat), 300);
    }

    onCategoryMouseOut(cat) {
      this.$timeout.cancel(this.timer);
    }


    /*********** legacy *************/

    // open(callback, element, orientation) {
    //   this.callback = callback;
    //
    //   this.selectEmojiCategory(0);
    //
    //   this.container.style.display = 'block';
    //   this.container.style.right = '20px';
    //   this.collection.scrollTop = 0;
    //   this.setPositionForContainer(element, orientation);
    //   this.widgetTimeoutId = setTimeout(() => this.close(), 300000000);
    // }

    close() {
      this.callback = null;

      // this.container.style.display = 'none';
    }

    smilesContainerElementClick(e) {
      console.log(e);
      let emoji = e.target.dataset.id;
      console.log(emoji);
      if (emoji && emoji in this.$emoji.utf16) {
        emoji = this.$emoji.utf16[emoji];
        this.$emoji.addRecentEmoji(emoji);
        emoji.bgPos = this.$emoji.getBgPosByUtf16(emoji.utf16);
        this.callback(emoji);
      }
    }

    // onCategoryMouseOver(category) {
    //   this.categoryTimeoutId = setTimeout(() => this.selectEmojiCategory(category), 300);
    // }
    // onCategoryMouseOut() {
    //   clearTimeout(this.categoryTimeoutId);
    // }
    onWidgetMouseOver() {
      clearTimeout(this.widgetTimeoutId);
    }

    onWidgetMouseOut() {
      this.widgetTimeoutId = setTimeout(() => this.close(), 300);
    }

    selectEmojiCategory(category) {
      if (typeof category !== 'undefined')
        this.category = category;

      this.smiles = this.$emoji.getCategory(category);

      setTimeout(() => {
        perfect_scrollbar.update(this.collection);
      }, 1);
    }

    setPositionForContainer(element, orientation) {
      function getOffset(elem) {
        if (elem.getBoundingClientRect) {
          // "правильный" вариант
          return getOffsetRect(elem)
        } else {
          // пусть работает хоть как-то
          return getOffsetSum(elem)
        }
      }

      function getOffsetSum(elem) {
        var top = 0, left = 0
        while (elem) {
          top = top + parseInt(elem.offsetTop)
          left = left + parseInt(elem.offsetLeft)
          elem = elem.offsetParent
        }

        return {top: top, left: left}
      }

      function getOffsetRect(elem) {
        // (1)
        var box = elem.getBoundingClientRect()

        // (2)
        var body = document.body
        var docElem = document.documentElement

        // (3)
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

        // (4)
        var clientTop = docElem.clientTop || body.clientTop || 0
        var clientLeft = docElem.clientLeft || body.clientLeft || 0

        // (5)
        var top = box.top + scrollTop - clientTop
        var left = box.left + scrollLeft - clientLeft

        return {top: Math.round(top), left: Math.round(left)}
      }

      let offset = getOffset(element);
      offset.top -= this.container.offsetHeight + 90;
      offset.left -= this.container.offsetWidth - 33;

      // this.container.style.left = `${offset.left}px`;
      // this.container.style.top = `${offset.top}px`;
    }
  })
  .name;