"use strict";

angular.module('app').factory('AuthService', function ($http, $location) {
  var loggedInUser;

  return {
    login : function(user) {

      var something;

      $http.post('/home', user)
        .success(function (data) {
          $location.path('/home');
          loggedInUser = data;
          something = data;
        })
        .error(function (data) {
          something = data;
        });

      return something;
    },
    logout : function () {},
    isLoggedIn: function() {},
    currentUser: function() { return currentUser; }
  };
});
