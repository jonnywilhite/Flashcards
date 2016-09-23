"use strict";

angular.module('app').controller('registerCtrl', function ($http, $location, $cookies) {
  var registerCtrlData = this;

  registerCtrlData.firstNameValid = false;
  registerCtrlData.firstNameTouched = false;
  registerCtrlData.usernameValid = false;
  registerCtrlData.usernameTouched = false;
  registerCtrlData.passwordValid = false;
  registerCtrlData.passwordTouched = false;
  registerCtrlData.passwordRetypeValid = false;
  registerCtrlData.passwordRetypeTouched = false;

  registerCtrlData.checkUsername = function () {
    registerCtrlData.usernameTouched = true;
    if (!registerCtrlData.newUsername) {
      registerCtrlData.usernameValid = false;
    } else {
      $http.get('/api/users/' + registerCtrlData.newUsername)
        .success(function (data) {
          if (data) {
            registerCtrlData.usernameValid = false;
          } else {
            registerCtrlData.usernameValid = true;
          }
        })
        .error(function (data) {
          console.log('Error getting the user: ' + data);
        });
    }
  };

  registerCtrlData.checkPassword = function () {
    registerCtrlData.passwordTouched = true;
    if (registerCtrlData.newPassword && registerCtrlData.newPassword.match(/[a-z]/i) && registerCtrlData.newPassword.match(/[0-9]/)) {
      registerCtrlData.passwordValid = true;
    } else {
      registerCtrlData.passwordValid = false;
    }

    if (registerCtrlData.passwordRetypeTouched) {
      registerCtrlData.checkPasswordRetype();
    }
  };

  registerCtrlData.checkPasswordRetype = function () {
    registerCtrlData.passwordRetypeTouched = true;
    if (registerCtrlData.newPassword && (registerCtrlData.newPassword === registerCtrlData.newPasswordRetype)) {
      registerCtrlData.passwordRetypeValid = true;
    } else {
      registerCtrlData.passwordRetypeValid = false;
    }
  };

  registerCtrlData.checkFirstName = function () {
    registerCtrlData.firstNameTouched = true;
    if (registerCtrlData.newFirstName) {
      registerCtrlData.firstNameValid = true;
    } else {
      registerCtrlData.firstNameValid = false;
    }
  };

  registerCtrlData.registerUser = function () {
    var user = {
      username : registerCtrlData.newUsername,
      password : registerCtrlData.newPassword,
      usernameLower : registerCtrlData.newUsername.toLowerCase(),
      firstName : registerCtrlData.newFirstName
    };
    $http.post('/api/users', user)
      .success(function (data) {
        $cookies.put('registered', true);
        $location.path('/login');
      })
      .error(function (data) {
        console.log('Error creating user: ' + data);
      });
  };

  registerCtrlData.goBack = function () {
    $location.path('/login');
  };
});
