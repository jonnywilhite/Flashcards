"use strict";

angular.module('app').controller('loginCtrl', function ($http, $location, $scope, AuthService) {
  var loginCtrlData = this;

  loginCtrlData.loggedInUser = AuthService.currentUser();
  console.log(AuthService.currentUser());
  loginCtrlData.errorMsg = "";

  if (loginCtrlData.loggedInUser) {
    $location.path('/home');
  }

  loginCtrlData.authenticate = function (user) {
    $http.post('/login', user)
      .success(function (data) {

        if (data) {
          AuthService.setUser(data);
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
