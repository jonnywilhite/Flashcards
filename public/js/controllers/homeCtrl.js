"use strict";

angular.module('app').controller('homeCtrl', function($http, $location, AuthService) {
  var homeCtrlData = this;

  homeCtrlData.flashcards = [];
  homeCtrlData.user = AuthService.currentUser();

  if (!homeCtrlData.user) {
    $location.path('/login')
  }

  $http.get('/api/flashcards')
    .success(function(data) {
      homeCtrlData.flashcards = data;
    })
    .error(function(data) {
      console.log('Error getting flashcards: ' + data);
    });
});
