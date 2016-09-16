"use strict";

var app = angular.module('app', []);

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
