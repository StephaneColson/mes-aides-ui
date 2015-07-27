angular.module('MASituation')
       .service('MASituation', Situation);


function Individu() {
    this.resources = {
        af: {
            '2014-07': 1440,
            '2014-08': 1440,
            '2014-09': 1440,
            '2014-10': 1440,
            '2014-11': 1440,
            '2014-12': 1440,
            '2015-01': 1440,
            '2015-02': 1440,
            '2015-03': 1340,
            '2015-04': 1340,
            '2015-05': 1340,
            '2015-06': 1340,
            '2015-07': 0
        },
        revenusSalarie: {
            '2014-07': 96,
            '2014-08': 96,
            '2014-09': 96,
            '2014-10': 96,
            '2014-11': 96,
            '2014-12': 96,
            '2015-01': 96,
            '2015-02': 96,
            '2015-03': 120,
            '2015-04': 120,
            '2015-05': 120,
            '2015-06': 120,
            '2015-07': 120
        }
    };
}

function Situation() {
    this.individus = [
        new Individu()
    ];
}
