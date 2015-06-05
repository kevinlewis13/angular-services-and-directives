'use strict';

require('../../../app/js/client');
require('angular-mocks');

describe('books controller', function() {
  var $ControllerConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module('booksApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it('should be able to create a new controller', function() {
    var booksController = $ControllerConstructor('booksController', {$scope: $scope});
    expect(typeof booksController).toBe('object');
    expect(Array.isArray($scope.books)).toBe(true);
    expect(Array.isArray($scope.errors)).toBe(true);
    expect(typeof $scope.getAll).toBe('function');
  });

  describe('REST functionality', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      this.notesController = $ControllerConstructor('booksController', {$scope: $scope});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a get request on index', function() {
      $httpBackend.expectGET('/api/books').respond(200, [{_id: 1, title: 'test title', author: 'test author'}]);
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.books[0].title).toBe('test title');
      expect($scope.books[0].author).toBe('test author');
      expect($scope.books[0]._id).toBe(1);
    });

    it('should correctly handle errors', function() {
      $httpBackend.expectGET('/api/books').respond(500, {msg: 'server error'});
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.errors.length).toBe(1);
      expect($scope.errors[0].msg).toBe('error stocking shelf');
    });

    it('should be able to save a new book', function() {
      var book = {title: 'test title2', author: 'test author2'};
      $httpBackend.expectPOST('/api/books').respond(200, {_id: 2, title: 'test title2', author: 'test author2'});
      $scope.createNewBook(book);
      $httpBackend.flush();
      expect($scope.books[0].title).toBe('test title2');
      expect($scope.books[0]._id).toBe(2);
      expect(book.title).toBe('');
      expect(book.author).toBe('');
      expect($scope.errors.length).toBe(0);
    });

    it('should remove a book', function() {
      var book = {_id: 3, title: 'testtitle3', author: 'testauthor3'};
      $scope.books.push(book);
      $httpBackend.expectDELETE('/api/books/3').respond(200, {msg: 'book deleted successfully'});

      expect($scope.books.indexOf(book)).not.toBe(-1);
      $scope.deleteBook(book);
      expect($scope.books.indexOf(book)).toBe(-1);
      $httpBackend.flush();
      expect($scope.errors.length).toBe(0);
    });

    it('should remove a book from the view even with a server error', function() {
      var book = {_id: 4, title: 'testtitle4', author: 'testauthor4'};
      $scope.books.push(book);
      $httpBackend.expectDELETE('/api/books/4').respond(500, {msg: 'big old problem'});

      expect($scope.books.indexOf(book)).not.toBe(-1);
      $scope.deleteBook(book);
      expect($scope.books.indexOf(book)).toBe(-1);
      $httpBackend.flush();
      expect($scope.errors.length).toBe(1);
      expect($scope.errors[0].msg).toBe('could not remove book: ' + book.title);
    });

    it('should update a book with edit', function() {
      var book = {_id: 5, title: 'testtitle5', author: 'testauthor5'};
      var updatedBook = {_id: 5, title: 'updatedtitle', author: 'updatedauthor'};
      $scope.books.push(book);
      $httpBackend.expectPUT('/api/books/5').respond(200, {msg: 'updated sucessfully'});

      $scope.saveBook(updatedBook);
      $httpBackend.flush();
      expect($scope.errors.length).toBe(0);
    });
  });
});
