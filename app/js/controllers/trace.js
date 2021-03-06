'use strict';

angular.module('ddsApp').controller('TraceCtrl', function($scope, $http, $stateParams) {
    $scope.investigation = {
        situationId: $stateParams.situationId,
    };

    $scope.toggle = function(name) {
        $scope.trace[name].isOpen = ! $scope.trace[name].isOpen;
    };

    $scope.refreshView = function() {
        if ($scope.rawData.requestedCalculations.length == 1) {
            $scope.investigation.root = $scope.rawData.requestedCalculations[0];
        }
        _.forEach($scope.trace, function(value) {
            value.isOpen = false;
        });
        $scope.name = $scope.investigation.root;
        $scope.trace[$scope.name].isOpen = true;
    };

    if (! $scope.investigation.situationId) {
        return;
    }

    $http.get('/api/situations/' + $scope.investigation.situationId + '/openfisca-trace')
        .then(function(response) {
            $scope.rawData = response.data;
            $scope.rawData.requestedCalculations.sort();
            $scope.trace = $scope.rawData.trace;

            var variables = Object.keys($scope.trace);
            variables.forEach(function(variable) {
                $scope.trace[variable].dependencies = _.uniq($scope.trace[variable].dependencies);
            });
        }, function(error) {
            $scope.error = error;
        });
});
