"use strict";

var app = angular.module('app', ['ngRoute', 'ngPageTitle', 'ngCookies']);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when("/", {
      redirectTo : "/login"
    })
    .when("/login", {
      templateUrl : "views/login.html",
      controller : "loginCtrl",
      data : {
        pageTitle: "FlashKardz® | Login"
      }
    })
    .when("/home", {
      templateUrl : "views/home.html",
      controller : "homeCtrl",
      data : {
        pageTitle: "FlashKardz® | Home"
      }
    });
    // .otherwise({
    //   redirectTo: "/login"
    // });

  $locationProvider.html5Mode(true);
});
