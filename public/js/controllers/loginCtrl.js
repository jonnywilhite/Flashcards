"use strict";

angular.module('app').controller('loginCtrl', function ($http, $location, $cookies, $timeout, AuthService) {
  var loginCtrlData = this;

  loginCtrlData.loggedInUser = {username: "", password: ""};
  loginCtrlData.errorMsg = "";

  if ($cookies.get('registered')) {
    loginCtrlData.registeredMsg = "Account created successfully! Happy studying!";
    $timeout(function () {
      document.getElementById('register-success').className += " animated fadeOut";
      $cookies.remove('registered');
    }, 3000);
  } else {
    loginCtrlData.registeredMsg = "";
  }

  loginCtrlData.authenticate = function (user) {
    $http.post('/login', user)
      .success(function (data) {

        if (data) {
          AuthService.setUser(data);
          $cookies.put('firstName', data.firstName);
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
