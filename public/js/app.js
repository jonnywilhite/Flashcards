"use strict";

var app = angular.module('app', ['ngRoute', 'ngPageTitle', 'ngCookies']);

app.config(function ($routeProvider, $locationProvider, $httpProvider) {
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
    })
    .when("/register", {
      templateUrl : "views/register.html",
      controller : "registerCtrl",
      data : {
        pageTitle: "FlashKardz® | Register"
      }
    })
    .when("/logout", {
      redirectTo: "/login"
    });
    // .otherwise({
    //   redirectTo: "/login"
    // });

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('httpRequestInterceptor');
})
.run(function ($cookies, $rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!$cookies.get('firstName')) {
      if (next.templateUrl == 'views/login.html' || next.templateUrl == 'views/register.html') {

      } else {
        $location.path('/login');
      }
    } else {
      if (next.templateUrl == 'views/home.html') {

      } else {
        $location.path('/home');
      }
    }
  });
});
