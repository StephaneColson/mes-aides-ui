'use strict';

angular.module('ddsApp').controller('FoyerEnfantCtrl', function($scope, $state, $stateParams) {
    $scope.individu = _.find($scope.situation.individus, { id: $stateParams.enfantId });
    $scope.$on('individu.enfant', function(e, enfant) {
        $state.go('foyer.enfants');
    });
});
