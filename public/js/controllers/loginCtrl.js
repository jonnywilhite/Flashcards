"use strict";

angular.module('app').controller('loginCtrl', function ($http, $location, $scope, $cookies, AuthService) {
  var loginCtrlData = this;

  loginCtrlData.loggedInUser = AuthService.currentUser();
  console.log($cookies.get('username'));
  loginCtrlData.errorMsg = "";

  if (loginCtrlData.loggedInUser || $cookies.get('username')) {
    $location.path('/home');
  }

  loginCtrlData.authenticate = function (user) {
    $http.post('/login', user)
      .success(function (data) {

        if (data) {
          AuthService.setUser(data);
          $cookies.put('username', data.username);
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
