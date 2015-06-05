'use strict';

module.exports = function(app) {
  app.directive('bookFormDirective', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: '/templates/directives/book_form.html',
      scope:{
        save: '&',
        buttonText: '=',
        labelText: '@',
        book: '='
      },
      transclude: true
    };
  });
};
