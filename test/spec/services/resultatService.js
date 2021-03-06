'use strict';

describe('ResultatService', function () {
    var service, droits, situation, openfiscaResult, DROITS_DESCRIPTION;

    beforeEach(function() {
        module('ddsApp');
        inject(function(ResultatService, droitsDescription)
        {
            service = ResultatService;
            DROITS_DESCRIPTION = droitsDescription;
        });

        situation = {
            dateDeValeur: '2014-11-01',
            individus: [{
                aah: {
                    '2014-11': 100
                },
                aide_logement: {
                    '2014-11': 100
                }
            },{
                ppa: {
                    '2014-11': 100
                }
            }]
        };

        openfiscaResult = {
            familles: {
                _: {
                    rsa_non_calculable: {
                        '2014-11': 'error'
                    }
                }
            },
            menages: {
                _: {
                    personne_de_reference: ['demandeur'],
                    depcom: {
                        '2014-11': '00000'
                    },
                }
            },
            individus: {
                demandeur: {
                    acs: {
                        '2014-11':100.25
                    },
                    cmu_c: {
                        '2014-11': false
                    }
                }
            }
        };
    });

    describe('_computeAides injected values', function() {
        beforeEach(function() {
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should extract injected droits', function() {
            expect(droits.droitsInjectes).toContain(DROITS_DESCRIPTION.prestationsNationales.caf.prestations.aah);
            expect(droits.droitsInjectes).toContain(DROITS_DESCRIPTION.prestationsNationales.caf.prestations.aide_logement);
            expect(droits.droitsInjectes).toContain(DROITS_DESCRIPTION.prestationsNationales.caf.prestations.ppa);
        });
    });

    describe('_computeAides of numeric value', function() {
        beforeEach(function() {
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should extract eligibles droits from openfisca result', function() {
            expect(droits.droitsEligibles.prestationsNationales.acs).toBeTruthy();
            expect(droits.droitsEligibles.prestationsNationales.acs.montant).toEqual(100);
            expect(droits.droitsEligibles.prestationsNationales.acs.provider.label).toEqual('Assurance maladie');
        });
    });

    describe('_computeAides of true boolean values', function() {
        beforeEach(function() {
            openfiscaResult.individus.demandeur.cmu_c['2014-11'] = true;
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should extract eligibles droits from openfisca result', function() {
            expect(droits.droitsEligibles.prestationsNationales.cmu_c).toBeTruthy();
            expect(droits.droitsEligibles.prestationsNationales.cmu_c.montant).toBeTruthy();
        });
    });

    describe('_computeAides uncomputability highlighted', function() {
        beforeEach(function() {
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should extract reason of uncomputability', function() {
            expect(droits.droitsEligibles.prestationsNationales.rsa.montant).toEqual('error');
        });
    });

    describe('_computeAides extraction of local partenaire without prestation', function() {
        beforeEach(function() {
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should exclude local partenaire without prestation', function() {
            expect(droits.droitsEligibles.partenairesLocaux.paris).toBeFalsy();
        });
    });
});
