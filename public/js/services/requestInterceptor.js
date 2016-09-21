"use strict";

angular.module('app').factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      config.headers['awesome-header'] = 'awesome-value';
      return config;
    }
  };
});
