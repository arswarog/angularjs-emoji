//AngularJS Directive with Isolated Scope
import angular from 'angular';
import emoji from '../src';

angular.module('arswarog.emoji.test', [emoji])
  .component('emojiTest', {
    controller: function ($scope, ) {
    }
  });

//*
//Directive Unit Tests
describe('myGreet directive:', function () {

  var scope, compile, validHTML;

  validHTML = '<span my-greet="name"></span>';

  beforeEach(module('myApp'));

  beforeEach(function(){
    //inject dependencies
    inject(function ($compile, $rootScope) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  });

  describe('when created', function () {
    it('should greet the name provided', function () {
      var elm;
      //arrange
      scope.name = 'Test';
      //act
      elm = compile(validHTML)(scope);
      //assert
      expect(elm.text()).toBe('Hello Test');
    });
    it('should watch for changes in the model', function () {
      var elm;

      //this is super brittle is there a better way!?
      elm = compile(validHTML)(scope);
      expect(elm.scope().$$watchers[0].exp).toBe('name');

      /* This version works fine when the scope is NOT isolated
       spyOn(scope, '$watch');
       elm = compile(validHTML)(scope);
       expect(scope.$watch.callCount).toBe(1);
       expect(scope.$watch).toHaveBeenCalledWith('name', jasmine.any(Function));
       */
    });
  });

  describe('when the model changes', function () {
    it('should greet the new name', function () {
      var elm;
      //arrange
      scope.name = 'John';
      //act
      elm = compile(validHTML)(scope);
      scope.name = 'Jane';
      scope.$apply();
      //assert
      expect(elm.text()).toBe('Hello Jane');
    });
  });
});
//*/