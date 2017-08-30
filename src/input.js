import angular from 'angular'

class InputCtrl {
  constructor($scope, $timeout, $log, $sce, Emoji) {
    this.$timeout = $timeout;
//        this.$scope   = $scope;
//        this.$modal   = Modal;
//        this.$toaster = Toaster;
//
//        $rootScope.$on('states.updateState', () => {
//            this.getState()
//        });
//        $rootScope.$on('states.update', () => {
//            this.getState()
//        });
  }

  $onInit() {
//        this.getState()
    this.$timeout(() => this.model = 'asdasd', 100);
  }

  set value(value) {
    this._value = value;
    this.html = this.$sce.trustAsHtml(this.encode(value));
  }

  get value() {
    return this._value;
  }
}

export default angular.module('arswarog.emoji.input', [])
  .component('emojiInput', {
    binding: {
      placeholder: '@',
      value: '=ngModel',
    },
    controller: InputCtrl,
    template: `<div class="emoji-input">
    <div class="messageContainer" ref="messageContainer">
      <i aria-hidden="true"
         ref="toggleButton"
         class="md-icon emoji_open md-theme-default material-icons"
         ng-click="toggleSmiles"
         unselectable="on"
         onselectstart="return false;"
         onmousedown="return false;">insert_emoticon</i>
      <div class="placeholder" v-show="empty">{{placeholder}}</div>
      <div class="message-text"
           ng-keypress="onKeypress"
           ng-keyup="changeMessage"
           ng-focus="onFocus"
           ng-click="onClick"
           ref="message"
           contenteditable="true"
           tabindex="1" ng-bind-html="$ctrl.html"><br/></div>
    </div>
  </div>`
  })
  .name;