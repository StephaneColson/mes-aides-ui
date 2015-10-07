'use strict';

angular.module('ddsApp').service('ResultatService', function($http, droitsDescription) {

    // Si la valeur renvoyée par l'API vaut null, cela signifie par convention que l'aide a été injectée et non recaculée par le simulateur
    function sortDroits(droitsCalcules) {
        var droitsEligibles = {},
            droitsInjectes = {},
            droitsNonEligibles = {};

        _.forEach(droitsDescription, function(description, droitKey) {
            if (droitsCalcules[droitKey]) {
                droitsEligibles[droitKey] = description;
                droitsEligibles[droitKey].montant = droitsCalcules[droitKey];
            } else if (droitsCalcules[droitKey] === null) {
                droitsInjectes[droitKey] = description;
            } else {
                droitsNonEligibles[droitKey] = description;
            }
        });
        return {
            droitsEligibles: droitsEligibles,
            droitsInjectes: droitsInjectes,
            droitsNonEligibles: droitsNonEligibles
        };
    }

    return {
        simulate: function(situation) {
            return $http.get('/api/situations/' + situation._id + '/simulation').then(function(response) {
                return sortDroits(response.data);
            });
        },
        sortDroits: sortDroits
    };
});