// let angular = require('angular');
let should = require('should');

console.log(require('../src/out'));

describe('base text functional', function () {

  // console.log(module);
  //
  // beforeEach(module('app'));
  //
  // var $controller;
  //
  // beforeEach(inject(function (_$controller_) {
  //   // The injector unwraps the underscores (_) from around the parameter names when matching
  //   $controller = _$controller_;
  // }));

  it('sets the strength to "strong" if the password length is >8 chars', function() {
    // var $scope = {};
    // var controller = $controller('PasswordController', { $scope: $scope });
    // $scope.password = 'longerthaneightchars';
    // $scope.grade();
    // expect($scope.strength).toEqual('strong');
  });

  // it('sets the strength to "strong" if the password length is >8 chars', function () {
  //   var $scope = {};
  //   var controller = $controller('PasswordController', {$scope: $scope});
  //   $scope.password = 'longerthaneightchars';
  //   $scope.grade();
  //   expect($scope.strength).toEqual('strong');
  // });

  // it('new line', function () {
  //   expect(scope.numberPattern.test("100")).toBe(true);
  //   // request.entityType.should.be.equal('command');
  //   // request.entity.command.text.should.be.equal('/start');
  //   // request.entity.params.should.be.empty;
  //   // ctrl.should.be.equal('Main:start');
  // });

  // it('Hi bot => /start', function () {
  //   let request = getRequest('/', 'text', {
  //     text: 'Hi bot'
  //   });
  //
  //   let ctrl = request.resolveCtrlByEntity();
  //
  //   request.entityType.should.be.equal('command');
  //   request.entity.command.text.should.be.equal('/hi');
  //   request.entity.params.should.be.empty;
  //   ctrl.should.be.equal('Main:hi');
  // });
});

//   describe('try any emojis', function () {
//
//     describe('commands:', function () {
//
//     it('/start => /start', function () {
//       let request = getRequest('/', 'text', {
//         text: '/start'
//       });
//
//       let ctrl = request.resolveCtrlByEntity();
//
//       request.entityType.should.be.equal('command');
//       request.entity.command.text.should.be.equal('/start');
//       request.entity.params.should.be.empty;
//       ctrl.should.be.equal('Main:start');
//     });
//
//     it('Hi bot => /start', function () {
//       let request = getRequest('/', 'text', {
//         text: 'Hi bot'
//       });
//
//       let ctrl = request.resolveCtrlByEntity();
//
//       request.entityType.should.be.equal('command');
//       request.entity.command.text.should.be.equal('/hi');
//       request.entity.params.should.be.empty;
//       ctrl.should.be.equal('Main:hi');
//     });
//
//   });
// });