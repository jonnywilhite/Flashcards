"use strict";

var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider.when("/", {
    templateUrl : "login.html",
    controller : "loginCtrl"
  })
  .when("/home", {
    templateUrl : "home.html",
    controller : "homeCtrl"
  });
});
