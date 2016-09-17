"use strict";

var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when("/login", {
      templateUrl : "views/login.html",
      controller : "loginCtrl"
    })
    .when("/home", {
      templateUrl : "views/home.html",
      controller : "homeCtrl"
    })
    .otherwise({
      redirectTo: "/login"
    });

  //$locationProvider.html5Mode(true);
});
