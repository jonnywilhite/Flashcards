"use strict";

angular.module('app').controller('loginCtrl', function ($http, $location, $scope, AuthService) {
  var loginCtrlData = this;

  loginCtrlData.loggedInUser = {};
  loginCtrlData.errorMsg = "";

  loginCtrlData.authenticate = function (user) {
    $http.post('/home', user)
      .success(function (data) {

        if (data) {
          AuthService.loggedInUser = data;
          $location.path('/home');
        } else {
          loginCtrlData.errorMsg = "Login failed. Please try again";
        }
      })
      .error(function (data) {
        loginCtrlData.errorMsg = "Login failed. Please try again";
      });
  };
});
