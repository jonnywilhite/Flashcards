"use strict";

angular.module('app').factory('AuthService', function ($http, $q, $timeout) {
  var loggedInUser;

  return {
    login : function(username, password) {
      var deferred = $q.defer();

      $http.post('/login', {username: username, password: password})
        .success(function (data, status) {
          if (status === 200 && data.status) {
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      return deferred.promise;
    },
    logout : function () {
      var deferred = $q.defer();

      $http.get('/logout')
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      return deferred.promise;
    },
    isLoggedIn: function() {
      if (loggedInUser) {
        return true;
      } else {
        return false;
      }
    },
    currentUser: function() { return loggedInUser; },
    setUser: function (user) {
      loggedInUser = user;
    }
  };
});
