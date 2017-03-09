"use strict";
var appName = "offset.tracker";
angular.module(appName).service("AuthService", [
    '$resource', 'ENV',
    function ($resource, ENV) {

        var url = ENV.apiEndpoint.auth;

        return $resource(url, {},
            {
                login: { method: "POST", params:{ action:"login" } },
                logout: { method: "GET", params:{ action:"logout" } }
            }
        );
    }]);