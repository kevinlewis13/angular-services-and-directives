'use strict';

module.exports = function(app) {
  app.controller('booksController', ['$scope', 'RESTResource', 'copy', function($scope, resource, copy) {
    var Book = resource('books');
    $scope.errors = [];
    $scope.books = [];

    $scope.getAll = function() {
      Book.getAll(function(err, data) {
        if (err) return $scope.errors.push({msg: 'error stocking shelf'});
        $scope.books = data;
      });
    };

    $scope.createNewBook = function(book) {
      $scope.books.push(book);
      //EITHER:
      var submitBook = copy(book);
      book.title = '';
      book.author = '';
      Book.create(submitBook, function(err, data) {
        if (err) return $scope.errors.push({msg: 'could not add new book'});
        $scope.books.splice($scope.books.indexOf(submitBook), 1, data);
      });
      // OR:
      //$scope.newBook = null;
    };

    $scope.saveBook = function(book) {
      book.editing = false;
      Book.save(book, function(err, data) {
        if (err) return $scope.errors.push({msg: 'could not update book'});
      });
    };

    $scope.deleteBook = function(book) {
      $scope.books.splice($scope.books.indexOf(book), 1);
      Book.remove(book, function(err, data) {
        if (err) $scope.errors.push({msg: 'could not remove book: ' + book.title});
      });
    };

    $scope.clearErrors = function() {
      $scope.errors = [];
      $scope.getAll();
    };

    $scope.cancelEdit = function(book) {
      book.title = $scope.originalTitle;
      book.author = $scope.originalAuthor;
      //book.author = $scope.books[$scope.books.indexOf(book)].title;
      //console.log(test);
      book.editing = false;
    };

    $scope.startEdit = function(book) {
      book.editing = true;
      $scope.originalTitle = book.title;
      $scope.originalAuthor = book.author;
      //it seems like this is just creating more variables, but cant think of a way around it.
    };

  }]);

};
