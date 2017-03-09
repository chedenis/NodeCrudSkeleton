"use strict";

//Interceptor which runs when I am going to any page
var appName = "offset.tracker";
angular.module(appName)
.factory('httpRequestInterceptor', ['$cookies','$location','$q', function ($cookies, $location, $q) {
    return {
        getUser: function () {
            return $cookies.getObject("currentUser") || {};
        },
        request: function (config) {
            var currentUser = $cookies.getObject("currentUser") || {};
            config.headers.Authorization = "Bearer " + currentUser.token || null;
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $location.path("/login").search('returnTo', $location.path());
            }
            return $q.reject(rejection);
        }
    };
}]);

angular.module(appName).config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});


angular.module(appName)
    .controller("auth.controller",
    ["$scope", "AuthService", '$cookies', '$routeParams', '$rootScope', '$window', '$location', '$sce',
        function ($scope, AuthService, $cookies, $routeParams, $rootScope, $window, $location, $sce) {
            $scope.login = function login() {
                AuthService.login({
                    username: $scope.userId, password: $scope.password
                }, function (result) {
                    $scope.currentUser = {user: result.user, userId: $scope.userId, token: result.token};
                    $cookies.putObject('currentUser', $scope.currentUser);
                    $window.location.href = "#/list";
                    $rootScope.$broadcast('authorized');
                    delete $rootScope.error;
                }, function (httpResponse) {
                    if (httpResponse.status === 401) {
                        $rootScope.error = $sce.trustAsHtml("<center>Incorrect username or password.<br/>Please try again.</center>");
                        $location.path("#/login");
                    }
                })
            }
        }]);
