"use strict";

angular.module('app').controller('loginCtrl', AuthService, function ($http, $location) {
  var loginCtrlData = this;

  loginCtrlData.loggedInUser = {};

  loginCtrlData.login = function (user) {
    AuthService.login(user);
  };
});
