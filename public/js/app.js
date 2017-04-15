"use strict";

var app = angular.module('app', ['ngRoute', 'ngPageTitle', 'ngCookies']);

app.config(function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when("/", {
                redirectTo: "/login"
            })
            .when("/login", {
                templateUrl: "views/login.html",
                controller: "loginCtrl as login",
                data: {
                    pageTitle: "eFlashcards | Login"
                }
            })
            .when("/home", {
                templateUrl: "views/home.html",
                controller: "homeCtrl as home",
                data: {
                    pageTitle: "eFlashcards | Home"
                }
            })
            .when("/register", {
                templateUrl: "views/register.html",
                controller: "registerCtrl as reg",
                data: {
                    pageTitle: "eFlashcards | Register"
                }
            })
            .when("/logout", {
                redirectTo: "/login"
            });

        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('httpRequestInterceptor');
    })
    .run(function($cookies, $rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
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