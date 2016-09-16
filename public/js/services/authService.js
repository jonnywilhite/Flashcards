"use strict";

angular.module('app').factory('AuthService', function ($http, $location) {
  var loggedInUser;

  return {
    login : function() {},
    logout : function () {},
    isLoggedIn: function() {},
    currentUser: function() { return loggedInUser; },
    setUser: function (user) {
      loggedInUser = user;
    }
  };
});
