"use strict";

angular.module('app').controller('homeCtrl', function($http) {
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
