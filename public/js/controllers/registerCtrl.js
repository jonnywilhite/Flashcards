"use strict";

angular.module('app').controller('registerCtrl', function ($http) {
  const registerCtrlData = this;

  registerCtrlData.usernameValid = false;
  registerCtrlData.passwordValid = false;
  registerCtrlData.passwordRetypeValid = false;
  registerCtrlData.usernameTouched = false;
  registerCtrlData.passwordTouched = false;
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
});
