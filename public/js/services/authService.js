"use strict";

angular.module('app').factory('AuthService', function ($http, $location) {
  var loggedInUser;

  return {
    login : function(user) {
      $http.post('/home', user)
        .success(function (data) {
          $location.path('/home');
          loggedInUser = data;
        })
        .error(function (data) {

        });
    },
    logout : function () {},
    isLoggedIn: function() {},
    currentUser: function() { return currentUser; }
  };
});
