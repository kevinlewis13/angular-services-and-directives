'use strict';

require('angular/angular');

var booksApp = angular.module('booksApp', []);

//services
require('./services/copy')(booksApp);
require('./services/rest_resource')(booksApp);

//controllers
require('./books/controllers/books_controller')(booksApp);

//directives
require('./directives/simple_directive')(booksApp);
require('./books/directives/book_form_directive')(booksApp);
