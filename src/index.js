import angular from 'angular';
import emoji from './emoji';
import container from './container';
import input from './input';
import out from './out';

export default angular.module('arswarog.emoji', [emoji, container, input, out])
  .name;