"use strict";
var appName = "offset.tracker";
angular.module(appName).controller("offsetList", ["$scope", "$q", "States", "OffsetService",
    function ($scope, $q, States, OffsetService) {


        $scope.alerts = [];
        $scope.search = { name: {} };
        $scope.states = States;


        //change to read offset ?
        $scope.readFacility = function readFacility(facilityEntityKey) {
            return $q(function (resolve, reject) {
                FacilityService.read({ entityKey: facilityEntityKey }, function (data) {
                    return resolve(data);
                }, function (err) {
                    return reject(err);
                });
            });
        }

        $scope.plans = [];
        OffsetService.list({ "approvalStatus": "Pending" }, function (data) {
            $scope.offsets = data;
        });
    }
]);

