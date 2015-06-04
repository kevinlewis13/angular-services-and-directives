'use strict';

module.exports = function(app) {
  app.controller('booksController', ['$scope', '$http', function($scope, $http) {
    $scope.errors = [];
    $scope.books = [];

    $scope.getAll = function() {
      $http.get('/api/books')
        .success(function (data) {
          $scope.books = data;
        })
        .error(function (error) {
          console.log(error);
          $scope.errors.push({msg: 'error retrieving books'});
        });
    };

    $scope.createNewBook = function(newBook) {
      $scope.books.push(newBook);
      //EITHER:
      var submitBook = $scope.newBook;
      $scope.newBook = null;
      $http.post('/api/books', submitBook) //could I just pass newBook in here? check.
        .error(function (error) {
          console.log(error);
          $scope.errors.push({msg: 'could not create new book'});
        });
      // OR:
      //$scope.newBook = null;
    };

    $scope.saveBook = function(book) {
      book.editing = false;
      $http.put('/api/books/' + book._id, book)
        .error(function (error) {
          console.log(error);
          $scope.errors.push({msg: 'could not update book'});
        });
    };

    $scope.deleteBook = function(book) {
      $scope.books.splice($scope.books.indexOf(book), 1);
      $http.delete('/api/books/' + book._id)
        .error(function (error) {
          console.log(error);
          $scope.errors.push({msg: 'could not delete book: ' + book.title});
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
