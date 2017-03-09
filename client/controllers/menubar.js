"use strict";
var appName = "offset.tracker";
angular.module(appName).controller("menubar",
    ["$scope", "$rootElement", "$rootScope", "$location","$window","$document", "$cookies", "AuthService", "httpRequestInterceptor",
    function ($scope, $rootElement, $rootScope, $location, $window, $document, $cookies, AuthService, httpRequestInterceptor) {
        $scope.title = "Resident Contact Manager" // $rootElement.attr("ng-app")
            .replace(/\./g, " ")
            .replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); // Title Case
        $document[0].title = $scope.title;

        $rootScope.$on('authorized', function() {
            $scope.user = httpRequestInterceptor.getUser().user;
            if($scope.user){
                $scope.activeUserName = $scope.user.userId;
                $scope.activeUserEmail = $scope.user.email;
                $scope.activeUserFirstName = $scope.user.name.first;
                $scope.activeUserLastName = $scope.user.name.last;
                $scope.activeUserFullName = $scope.activeUserFirstName + " " + $scope.activeUserLastName;
            }
        });

        $scope.user = httpRequestInterceptor.getUser().user;
        if($scope.user){
            $scope.activeUserName = $scope.user.userId;
            $scope.activeUserEmail = $scope.user.email;
            $scope.activeUserFirstName = $scope.user.name.first;
            $scope.activeUserLastName = $scope.user.name.last;
            $scope.activeUserFullName = $scope.activeUserFirstName + " " + $scope.activeUserLastName;
        }

        $scope.showIfNotOnPath = function (viewLocation) {
            return viewLocation !== $location.path();
        }

        $scope.isActive = function (viewLocation) {
            return $location.path().indexOf(viewLocation) == 0;
        };

        $scope.logout = function logout() {
            var currentUser = $cookies.getObject("currentUser");
            AuthService.logout(function (data) {
                $cookies.remove("currentUser");
                $location.path("/login");
            });
        }
}]);
