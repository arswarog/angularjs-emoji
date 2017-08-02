import angular from 'angular';
import perfect_scrollbar from 'angular-perfect-scrollbar';

let template = `
<div
    v-show="smilesContainerIsShowed"
    id="emoji-container"
    class="emoji-container smile24"
    ref="emoji-container"
    onselectstart="return false;"
    onmousedown="return false;"
    ng-mouseover="onWidgetMouseOver()"
    ng-mouseout="onWidgetMouseOut()">
  <perfect-scrollbar class="smilesCollection" ref="smilesCollection">
    <i ng-repeat="smile in smiles" class="emoji emoji-{{smile.unified}}" unselectable="on" ng-click="emojiClick(smile)"></i>
  </perfect-scrollbar>
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

export default angular.module('arswarog.emoji.container', [perfect_scrollbar])
  .directive('emojiContainer', function (Emoji, $timeout) {
    return {
      template: template,
      replace: true,
      restrict: 'AE',
      scope: {
        preview: '=preview',
      },
      controller: function ($scope) {
        let timer = false;
        $scope.smiles = Emoji.getCategory();

        $scope.emojiClick = function (e) {
          Emoji.addRecentEmoji(e);
        }

        $scope.onCategoryMouseOver = function (cat) {
          $timeout.cancel(timer);
          timer = $timeout(() => $scope.smiles = Emoji.getCategory(cat), 300);
        }

        $scope.onCategoryMouseOut = function (cat) {
          $timeout.cancel(timer);
        }
      }
    }
  })
  .name;