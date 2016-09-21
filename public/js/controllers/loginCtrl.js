"use strict";

angular.module('app').controller('loginCtrl', function ($http, $location, $cookies, AuthService) {
  var loginCtrlData = this;

  loginCtrlData.loggedInUser = {username: "", password: ""};
  loginCtrlData.errorMsg = "";

  loginCtrlData.authenticate = function (user) {
    $http.post('/login', user)
      .success(function (data) {

        if (data) {
          AuthService.setUser(data);
          $cookies.put('username', data.username);
          $location.path('/home');
        } else {
          loginCtrlData.errorMsg = "Login failed. Please try again";
          loginCtrlData.loggedInUser = {};
        }
      })
      .error(function (data) {
        loginCtrlData.errorMsg = "Login failed. Please try again";
        loginCtrlData.loggedInUser = {};
      });
  };

  loginCtrlData.registerNew = function () {
    $location.path('/register');
  };
});
