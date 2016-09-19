"use strict";

angular.module('app').controller('homeCtrl', function($http, $location, $cookies, AuthService) {
  var homeCtrlData = this;

  homeCtrlData.flashcards = [];
  homeCtrlData.quizViewShown = true;
  homeCtrlData.editViewShown = false;
  homeCtrlData.username = (AuthService.currentUser() && AuthService.currentUser().username) || $cookies.get('username');

  $http.get('/api/flashcards')
    .success(function(data) {
      homeCtrlData.flashcards = data;
    })
    .error(function(data) {
      console.log('Error getting flashcards: ' + data);
    });

  homeCtrlData.showQuestion = function () {
    if (homeCtrlData.fcIndex == homeCtrlData.flashcards.length) {
      homeCtrlData.reset();
    } else {
      homeCtrlData.flashcardDisplayed = true;
      homeCtrlData.answerDisplayed = false;
      homeCtrlData.questionDisplayed = true;
      homeCtrlData.currentQuestion = homeCtrlData.flashcards[homeCtrlData.fcIndex].question;
    }
  };

  homeCtrlData.showAnswer = function () {
    homeCtrlData.questionDisplayed = false;
    homeCtrlData.answerDisplayed = true;
    homeCtrlData.currentAnswer = homeCtrlData.flashcards[homeCtrlData.fcIndex].answer;
    homeCtrlData.fcIndex++;
  };

  homeCtrlData.logout = function () {
    $http.get('/logout')
      .success(function (data) {
        $cookies.remove('username');
        $location.path('/logout');
      })
      .error(function (data) {
        $cookies.remove('username');
        $location.path('/logout');
      });
  };

  homeCtrlData.showNewView = function (divId) {
    document.getElementById('quiz-div').style.display = 'none';
    document.getElementById('edit-div').style.display = 'none';
    document.getElementById(divId).style.display = 'inline';

    if (divId === 'quiz-div') {
      homeCtrlData.quizViewShown = true;
      homeCtrlData.editViewShown = false;
    } else {
      homeCtrlData.quizViewShown = false;
      homeCtrlData.editViewShown = true;
    }
    homeCtrlData.reset();
  };

  homeCtrlData.reset = function () {
    homeCtrlData.fcIndex = 0;
    homeCtrlData.flashcardDisplayed = false;
    homeCtrlData.questionDisplayed = false;
    homeCtrlData.answerDisplayed = false;
    homeCtrlData.currentQuestion = "";
    homeCtrlData.currentAnswer = "";
  };
  homeCtrlData.reset();

});
