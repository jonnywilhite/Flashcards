"use strict";

angular.module('app').controller('loginCtrl', function ($http) {
  var loginCtrlData = this;

  loginCtrlData.username = "";
  loginCtrlData.password = "";

  loginCtrlData.login = function () {
    $http.post()
  };
});
