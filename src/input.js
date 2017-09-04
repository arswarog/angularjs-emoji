import angular from 'angular'
require('./input.css');

class InputCtrl {
  constructor(Emoji) {
    this.$emoji = Emoji;

    this.position = 'topLeft';
    this.restrict = 'E';
    this.scope = {
      placeholder: '@',
      value: '=ngModel'
    };
    this.link = (scope, element, attributes, controller, transcludeFn) => this.linkIt(scope, element, attributes, controller, transcludeFn);
    //    props: ['value', 'placeholder', 'autofocus'],


    /// data = {
    // count: 1,
    //   smileContainerOffset: 48,
    //   categoryTimeoutId: false,
    //   category: 0, }
  }

  // compile(element, attributes) {
  //   return {
  //     pre: this.pre,
  //     post: this.post,
  //   }
  // }

  // pre(scope, element, attributes, controller, transcludeFn) {
  //   console.log(element)
  //   // var text = element.text();
  //   // element.text(text + ' Third');
  //   // return;
  //
  //   // templateElement.html("<div>{{ertert}}asdasd</div>");
  //   this.messageContainer = document.createElement('div');///, {
  //     // class: "message-text"
  //     // ng-keypress="onKeypress"
  //     // ng-keyup="changeMessage"
  //     // ng-focus="onFocus"
  //     // ng-click="onClick"
  //     // ref="message"
  //     // :placeholder="placeholder ? placeholder : 'Введите сообщение'"
  //     // contenteditable="true"
  //     // tabindex="1" ng-bind-html="$ctrl.html"
  //   // });
  //
  //   element[0].appendChild(this.messageContainer, null);
  //
  //   console.log(this.messageContainer)
  //   console.log(element[0]);
  //
  //
  //   // element.class="pretty-input";
  //
  //
  //   //   <div class="messageContainer" ref="messageContainer">
  //   //     <!--<i aria-hidden="true"-->
  //   //        <!--ref="toggleButton"-->
  //   //        <!--class="md-icon emoji_open md-theme-default material-icons"-->
  //   //        <!--ng-click="toggleSmiles"-->
  //   //        <!--unselectable="on"-->
  //   //        <!--onselectstart="return false;"-->
  //   //        <!--onmousedown="return false;">insert_emoticon</i>-->
  //   //     <div class="message-text"
  //   //          ng-keypress="onKeypress"
  //   //          ng-keyup="changeMessage"
  //   //          ng-focus="onFocus"
  //   //          ng-click="onClick"
  //   //          ref="message"
  //   //          :placeholder="placeholder ? placeholder : 'Введите сообщение'"
  //   //          contenteditable="true"
  //   //          tabindex="1" ng-bind-html="$ctrl.html"><br/></div>
  //   //   </div>
  // }

  linkIt(scope, element, attributes, controller, transcludeFn) {
    this.$scope = scope;
    console.log('link');
    this.asd = 'asd';
    if (!scope.placeholder)
      scope.placeholder = 'Текст';

    this.messageContainer = element[0];
    this.messageContainer.className = 'pretty-input';

    this.messageInput = document.createElement('div');
    this.messageInput.className = "message-text";
    this.messageInput.placeholder = scope.placeholder;
    this.messageInput.contentEditable = true;
    this.messageInput.onkeypress = (e) => this.onKeypress(e);
    this.messageInput.onkeyup = (e) => this.changeMessage(e);
    this.messageInput.onfocus = (e) => this.onFocus(e);
    this.messageInput.onclick = (e) => this.onClick(e);
    this.messageContainer.appendChild(this.messageInput);

    this.emojiButton = document.createElement('i');
    this.emojiButton.className = "emoji-button fa fa-smile-o";
    this.emojiButton.contentEditable = false;
    this.emojiButton.unselectable = (e) => false;
    this.emojiButton.onselectstart = (e) => false;
    this.emojiButton.onmousedown = (e) => false;
    this.emojiButton.onclick = (e) => this.toggleSmiles();
    this.messageContainer.appendChild(this.emojiButton);


    console.log(this.messageContainer);


    this.messageInput.appendChild(document.createTextNode('asdfasd'));

    scope.$watch('value', (value) => this.value = value);

    // <div class="messageContainer" ref="messageContainer">
    //   //     <div class="message-text"
    //   //          ng-keypress="onKeypress"
    //   //          ng-keyup="changeMessage"
    //   //          ng-focus="onFocus"
    //   //          ng-click="onClick"
    //   //          ref="message"
    //   //          :placeholder="placeholder ? placeholder : 'Введите сообщение'"
    //   //          contenteditable="true"
    //   //          tabindex="1" ng-bind-html="$ctrl.html"><br/></div>
    //   //   </div>

  }

  // link(scope, element, attrs) {
  //
  // }

  set value(value) {
    console.log('set value', value, this.$emoji.replaceEmojis(value));
    if (this.message == value)
      return;

    this.message = value;
    this.messageInput.innerHTML = this.$emoji.replaceEmojis(value, true);
    // this.html = this.$sce.trustAsHtml(this.encode(value));
  }

  get value() {
    return this.getMessage();
  }

  /*** warning! legacy code ******/
  legacyFunc() {
    let object = {
      mounted() {
        if (this.autofocus === '' || this.autofocus === 'on') {
          this.$nextTick(() => this.setCursorToEnd());
        }
      },
    };
  }

  onKeypress(e) {
    console.log(this);
    this.$emit('keypress', e);
    this.changeMessage();
  }

  toggleSmiles() {
    this.$emoji.showContainer((emoji) => this.insertSmileAtCursor(emoji), this.emojiButton, this.position);
  }

  insertSmileAtCursor(smile) {
    console.log('insertSmileAtCursor', smile, this);

    const img = document.createElement('IMG');
    img.src = '/static/blank.gif';
    img.className = 'emoji';
    img.dataset.emoji = smile.utf;
    img.style.backgroundPosition = this.$emoji.getBgPosByUtf16(smile);

    const sel = window.getSelection();
    if (sel && sel.focusNode) {
      if (sel.rangeCount) {
        if (sel.focusNode.nodeType === 3) { // text node
          const before = sel.focusNode.nodeValue.substring(0, sel.focusOffset);
          sel.focusNode.nodeValue = sel.focusNode.nodeValue.substring(sel.focusOffset);

          if (before)
            this.messageInput.insertBefore(document.createTextNode(before), sel.focusNode);
          this.messageInput.insertBefore(img, sel.focusNode);
          console.log(sel.focusNode.parentNode.childNodes);
          console.log(sel.focusNode.parentNode.childNodes[0]);
          console.log(sel.focusNode.parentNode.childNodes[1]);
          console.log(sel.focusNode.parentNode.childNodes[2]);
          this.setCursorAfterElement(img);
        } else if (sel.focusNode === this.messageInput) { // root node
          const item = this.messageInput.childNodes[sel.focusOffset];
          this.messageInput.insertBefore(img, item);
          this.setCursorAfterElement(img);
        } else { // not focus
          this.messageInput.appendChild(img);
          this.setCursorToEnd();
        }
      }
    } else {
      console.log(this, this.messageInput);
      this.messageInput.appendChild(img);
      this.setCursorToEnd();
    }

    this.changeMessage();
  }

  getRange() {
    if (document.getSelection) {
      const sel = document.getSelection();
      if (sel.rangeCount > 0)
        return sel.getRangeAt(0);
    }
    return false;
  }

  setRange(range) {
    if (document.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  setCursorAfterElement(el) {
    const range = document.createRange();
    range.setStartAfter(el);
    range.setEndAfter(el);
    this.setRange(range);
  }

  setCursorToEnd() {
    this.messageInput.focus();
    if (window.getSelection && document.createRange) {
      const range = document.createRange();
      range.selectNodeContents(this.messageInput);
      range.collapse(false);
      this.setRange(range);
    }
  }

  onClick(e) {
    if (e.target.className === 'emoji')
      this.setCursorAfterElement(e.target);
  }

  getMessage() {
    let text = '';

    const message = this.messageInput;

    if (message.childNodes.length && message.childNodes[0].nodeName === 'BR')
      message.removeChild(message.childNodes[0]);

    for (let i = 0; i < message.childNodes.length; i += 1) {
      const node = message.childNodes[i];
      if (node.nodeType === 3)
        text += node.nodeValue;
      else if (node.nodeName === 'BR')
        text += '\n';
      else if (node.nodeName === 'IMG' && node.className === 'emoji') {
        text += node.dataset.emoji; // `<i class="emoji emoji-${node.className.substring(12)}">&nbsp;</i>`;
      } else node.parentNode.removeChild(node);
    }

    this.message = text.trim()
    return this.message;
  }

  sendMessage() {
    this.$emit('sendmessage', this.getMessage());
    this.messageInput.innerHTML = '';
    this.messageInput.focus();
  }

  changeMessage() {
    const message = this.getMessage();
    this.$emit('input', message);
    this.$emit('updated');
  }

  onFocus() {
    this.$emit('focus');
  }

  $emit(event, data) {
    console.log('$emit "%s"', event, data);
    switch(event) {
      case 'input': this.$scope.value = data;
    }
  }
}

export default angular.module('arswarog.emoji.input', [])
  .directive('prettyInput', function (Emoji) {
    return new InputCtrl(Emoji)

    // return controller;
  })
  .name;

