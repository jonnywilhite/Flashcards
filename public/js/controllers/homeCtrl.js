"use strict";

angular.module('app').controller('homeCtrl', function($http, $location, $cookies, AuthService) {
  var homeCtrlData = this;

  homeCtrlData.flashcards = [];
  homeCtrlData.quizViewShown = true;
  homeCtrlData.editViewShown = false;
  homeCtrlData.firstName = (AuthService.currentUser() && AuthService.currentUser().firstName) || $cookies.get('firstName');

  homeCtrlData.getCards = function () {
    $http.get('/api/flashcards')
      .success(function(data) {
        homeCtrlData.flashcards = data;
      })
      .error(function(data) {
        console.log('Error getting flashcards: ' + data);
      });
  };

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

  homeCtrlData.showNext = function () {
    if (homeCtrlData.flashcardDisplayed) {
      if (homeCtrlData.questionDisplayed) {
        homeCtrlData.showAnswer();
      } else {
        homeCtrlData.showQuestion();
      }
    }
  };

  homeCtrlData.logout = function () {
    $http.get('/logout')
      .success(function (data) {
        $cookies.remove('firstName');
        $location.path('/logout');
      })
      .error(function (data) {
        $cookies.remove('firstName');
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
    homeCtrlData.checkedCount = 0;
    homeCtrlData.selected = "";
    homeCtrlData.dirtyCards = [];
    homeCtrlData.isAdding = false;
    homeCtrlData.newCard = {};
    homeCtrlData.getCards();
    document.getElementById('check-all').checked = false;
    var checkboxes = document.getElementsByClassName('my-checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  };
  homeCtrlData.reset();

  homeCtrlData.checkUncheck = function () {
    var checkboxes = document.getElementsByClassName('my-checkbox');
    var checkAllButton = document.getElementById('check-all');
    var anyChecked = false;
    var allChecked = true;
    homeCtrlData.checkedCount = 0;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        homeCtrlData.checkedCount++;
        anyChecked = true;
      } else {
        allChecked = false;
      }
    }

    if (allChecked) {
      checkAllButton.checked = true;
    } else {
      checkAllButton.checked = false;
    }
  };

  homeCtrlData.checkUncheckAll = function () {
    var checkboxes = document.getElementsByClassName('my-checkbox');
    if (document.getElementById('check-all').checked) {
      homeCtrlData.checkedCount = homeCtrlData.flashcards.length;
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
      }
    } else {
      homeCtrlData.checkedCount = 0;
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
    }
  };

  homeCtrlData.getTemplate = function (flashcard) {
    if (flashcard._id === homeCtrlData.selected._id) {
      return 'edit';
    } else {
      return 'display';
    }
  };

  homeCtrlData.getNewCardTemplate = function () {
    if (homeCtrlData.isAdding) {
      return 'edit-new';
    } else {
      return 'display-new';
    }
  };

  homeCtrlData.editCard = function (flashcard) {
    homeCtrlData.isAdding = false;
    var checkboxes = document.getElementsByClassName('my-checkbox');
    document.getElementById('check-all').checked = false;
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    homeCtrlData.checkedCount = 0;

    if (homeCtrlData.selected) {
      for (var i = 0; i < homeCtrlData.flashcards.length; i++) {
        if (homeCtrlData.flashcards[i]._id === homeCtrlData.selected._id) {
          homeCtrlData.flashcards[i] = homeCtrlData.selected;
        }
      }
    }
    homeCtrlData.selected = angular.copy(flashcard);
    var found = false;
    var indexFound = -1;
    for (var i = 0; i < homeCtrlData.dirtyCards.length; i++) {
      if (homeCtrlData.dirtyCards[i]._id === homeCtrlData.selected._id) {
        found = true;
        indexFound = i;
      }
    }
    if (!found) {
      homeCtrlData.dirtyCards.push(homeCtrlData.selected);
    } else {
      homeCtrlData.dirtyCards.splice(indexFound, 1);
      homeCtrlData.dirtyCards.push(homeCtrlData.selected);
    }
  };

  homeCtrlData.saveCards = function () {
    for (var i = 0; i < homeCtrlData.dirtyCards.length; i++) {
      $http.put('/api/flashcards/' + homeCtrlData.dirtyCards[i]._id, homeCtrlData.dirtyCards[i])
        .success(function (data) {
          homeCtrlData.getCards();
        })
        .error(function (data) {
          console.log('Error updating cards: ' + data);
        });
    }

    homeCtrlData.selected = "";
    homeCtrlData.dirtyCards = [];
    homeCtrlData.newCard = {};
  };

  homeCtrlData.deleteCards = function () {
    var checkboxes = document.getElementsByClassName('my-checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        $http.delete('api/flashcards/' + checkboxes[i].id)
          .success(function (data) {
            homeCtrlData.getCards();
            homeCtrlData.reset();
          })
          .error(function (data) {
            console.log('Error deleting cards: '+ data);
          });
      }
    }
  };

  homeCtrlData.addNewRow = function () {
    homeCtrlData.isAdding = true;

    var checkboxes = document.getElementsByClassName('my-checkbox');
    document.getElementById('check-all').checked = false;
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    homeCtrlData.checkedCount = 0;
  };

  homeCtrlData.saveNewCard = function () {
    $http.post('api/flashcards', homeCtrlData.newCard)
      .success(function (data) {

      })
      .error(function (data) {
        console.log('Error saving card: ' + data);
      });

    homeCtrlData.reset();
  };

});
