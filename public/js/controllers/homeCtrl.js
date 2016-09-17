"use strict";

angular.module('app').controller('homeCtrl', function($http, $location, $cookies, AuthService) {
  var homeCtrlData = this;

  homeCtrlData.flashcards = [];
  homeCtrlData.username = (AuthService.currentUser() && AuthService.currentUser().username) || $cookies.get('username');

  // if (!homeCtrlData.user) {
  //   $location.path('/login')
  // }

  $http.get('/api/flashcards')
    .success(function(data) {
      homeCtrlData.flashcards = data;
    })
    .error(function(data) {
      console.log('Error getting flashcards: ' + data);
    });
});
