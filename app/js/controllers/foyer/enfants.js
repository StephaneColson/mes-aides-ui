'use strict';

angular.module('ddsApp').controller('FoyerEnfantsCtrl', function($scope, $location, $anchorScroll, $timeout, SituationService) {
    $scope.enfants = _.filter($scope.situation.individus, { role: 'enfant' });

    $scope.$on('individu.enfant', function(e, enfant) {
        $scope.enfants.push(enfant);
        SituationService.setEnfants($scope.situation, $scope.enfants);
        $scope.displayForm = false;
        var addEnfantButton = document.querySelector('.new-entity');
        addEnfantButton.focus();
    });

    $scope.$on('actionCancelled', function() {
        $scope.displayForm = false;
    });

    $scope.newEnfant = function() {
        $scope.displayForm = true;
        $timeout(function() { $anchorScroll('new'); });
    };

    $scope.showEnfant = function() {
        $scope.displayForm = true;
    };

    $scope.removeEnfant = function(enfant) {
        var index = $scope.enfants.indexOf(enfant);
        $scope.enfants.splice(index, 1);
    };

    $scope.validate = function() {
        $state.go('foyer.conjoint');
    };
});
