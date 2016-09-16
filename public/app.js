"use strict";

var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider.when("/", {
    templateUrl : "login.html"
  })
  .when("home" {
    templateUrl : "home.html"
  });
});

app.controller('loginCtrl', function () {
  var loginCtrlData = this;

  loginCtrlData.username = "";
  loginCtrlData.password = "";
});

app.controller('homeCtrl', function($http) {
  var homeCtrlData = this;

  homeCtrlData.flashcards = [];

  $http.get('/api/flashcards')
    .success(function(data) {
      homeCtrlData.flashcards = data;
    })
    .error(function(data) {
      console.log('Error getting flashcards: ' + data);
    });
});
