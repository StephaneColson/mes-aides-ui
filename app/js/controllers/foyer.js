'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $state, $stateParams, $filter, $location, SituationService, IndividuService) {
    var situation = $scope.situation = SituationService.restoreLocal();

    $scope.restoreRemoteSituation = function(situationId) {
        return SituationService.restoreRemote(situationId)
        .then(function(persistedSituation) {
            situation = $scope.situation = persistedSituation;
            $scope.$broadcast('newSituation');
            return situation;
        });
    };

    $scope.persistLocalSituation = function() {
        return SituationService.save(situation).then(function(situation) { return situation._id; })
        .then(SituationService.restoreRemote)
        .then(function(persistedSituation) {
            situation = $scope.situation = persistedSituation;
            return situation;
        });
    };

    $scope.statutsSpecifiques = IndividuService.formatStatutsSpecifiques;
    $scope.nationalite = IndividuService.nationaliteLabel;
    $scope.getLabel = IndividuService.label;

    $scope.$on('individu.demandeur', function(e, demandeur) {
        if (_.find(situation.individus, { role: 'demandeur' })) {
            situation.individus[0] = demandeur;
        } else {
            situation.individus.push(demandeur);
        }
        $state.go('foyer.enfants');
    });

    $scope.$on('individu.conjoint', function(e, conjoint) {
        SituationService.setConjoint(situation, conjoint);

        var demandeur = SituationService.getDemandeur(situation);
        demandeur.statut_marital = conjoint.statut_marital;

        $state.go('foyer.logement');
    });

    $scope.$on('logement', function(e) {
        $scope.$broadcast('logementCaptured');
        $state.go('foyer.ressources.individu.types', { individu: 0 });
    });

    $scope.$on('pensionsAlimentaires', function() {
        $scope.$broadcast('ressourcesUpdated');
        $state.go('foyer.resultat');
    });

    $scope.$on('rnc', function() {
        $scope.$broadcast('ym2Captured');
        // si un enfant est scolarisé on demande son rfr (bourses collège/lycée), sinon pas besoin
        if (SituationService.hasEnfantScolarise($scope.situation)) {
            $state.go('foyer.rfr');
        } else {
            $state.go('foyer.resultat');
        }
    });

    $scope.$on('rfr', function(e) {
        $scope.$broadcast('ym2Captured');
        $state.go('foyer.resultat');
    });

    $scope.$on('patrimoine', function(e) {
        $scope.$broadcast('patrimoineCaptured');
        $state.go('foyer.resultat');
    });
});
