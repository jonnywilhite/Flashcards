"use strict";

angular.module('app').controller('loginCtrl', function ($http, $location, AuthService) {
  var loginCtrlData = this;

  loginCtrlData.loggedInUser = {};
  loginCtrlData.errorMsg = "";

  loginCtrlData.login = function (user) {
    var returnData = AuthService.login(user);
    if (!returnData) {
      loginCtrlData.errorMsg = "Login failed. Please try again."
    }
  };
});
