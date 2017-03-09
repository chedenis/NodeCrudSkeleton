"use strict";
var appName = "offset.tracker";
angular.module(appName, [
    "ngRoute",
    "ngResource",
    "ui.select",
    "ngCookies",
    "ui.bootstrap",
    "config",
    "angular-ladda",
    "angularUtils.directives.dirPagination"
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/list", {
        templateUrl: "views/offsetList.html",
        controller: "offsetList"
    }).when("/login:token?", {
        templateUrl: 'auth/login.view.html',
        controller: 'auth.controller'
    }).otherwise({
        redirectTo: "/login"
    });
}]);
