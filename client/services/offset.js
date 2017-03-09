"use strict";
var appName = "offset.tracker";
angular.module(appName).service("OffsetService", [
    "$resource", "ENV",
    function ($resource, ENV) {

        var url = ENV.apiEndpoint.offset;

        return $resource(url + "/:action/:entityKey", {},
            {
                create: { method: "POST", params: { action: "create" } },
                read: { method: "GET", params: { action: "read" } },
                update: { method: "Post", params: { action: "update" } },
                list: { method: "POST", params: { action: "list" }, isArray: true }
            });
    }
]);

