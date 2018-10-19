/// <reference types="Cypress" />
describe('Vous', () => {
   beforeEach(() => {
     cy.visit('/foyer/demandeur')
   })

  it('Validate empty form', () => {
    cy.get('form').submit()
    cy.get('#help-date-de-naissance')
    .should('contain', 'Ce champ est obligatoire.')
  })

  it('Invalid birthday date with unknown date', () => {
    cy.get('[data-cy=BirthdayDate]').type('31021985')
    cy.get('form').submit()
    cy.get('#help-date-de-naissance')
    .should('contain', 'Veuillez utiliser le format JJ\/MM\/AAAA')
  })

  it('Invalid birthday date with date in the future', () => {
    cy.get('[data-cy=BirthdayDate]').type('30012050')
    cy.get('form').submit()
    cy.get('#help-date-de-naissance')
    .should('contain', 'Cette personne doit être déjà née pour être prise en compte')
  })

  it('Too old not taken into account', () => {
    cy.get('[data-cy=BirthdayDate]').type('01011880')
    cy.get('form').submit()
    cy.get('#help-date-de-naissance')
    .should('contain', 'Les personnes de plus de 130 ans ne sont pas prises en compte')
  })

  it('Nationalité EEE - UE - Suisse ajoute texte', () => {
    cy.get('[data-cy=nationalite-ue]').check()
    cy.contains('Détenteur d‘un droit au séjour valide et résidant en France plus de 9 mois par an')
  })

  it('Nationalité Hors UE ajoute texte', () => {
    cy.get('[data-cy=nationalite-autre]').check()
    cy.contains('Détenteur d‘une carte de résident ou d‘un titre de séjour valide et résidant en France plus de 9 mois par an')
  })

  // it('TODO: tester que nationalité FR ne rajoute rien sur la page', () => {
  // })

  it('Etudiant ajoute widget boursier', () => {
    cy.get('form').contains('Étudiant\·e').click()
    cy.contains('À quel échelon êtes-vous boursier')
  })

  it('Inscrit·e comme demandeur d’emploi ajoute widget boursier', () => {
    cy.get('form').contains('Inscrit\·e comme demandeur d\’emploi').click()
    cy.contains('Quand s’est terminé votre dernier contrat de travail')
  })

  it('Inscrit·e comme demandeur d’emploi avec date dans le futur', () => {
    cy.get('form').contains('Inscrit\·e comme demandeur d\’emploi').click()
    cy.get('#last-job-end-date').type('122050')
    cy.get('form').submit()
    cy.get('.help-block')
      .contains('Le simulateur ne permet pas d\'indiquer une date de fin de travail dans le futur')
  })

  it('Inscrit·e comme demandeur d’emploi avec date valide ajoute travail 10 ans', () => {
    cy.get('form').contains('Inscrit\·e comme demandeur d\’emploi').click()
    cy.get('#last-job-end-date').type('102016')
    // Todo: cannot assert this text in one shot and cannot get an ID!?
    cy.get('.from-group-lg.ng-scope > .ng-scope > .form-group > .col-sm-4')
      .contains('Avez-vous')
    cy.get('.from-group-lg.ng-scope > .ng-scope > .form-group > .col-sm-4')
      .contains('travaillé au moins')
    cy.get('.from-group-lg.ng-scope > .ng-scope > .form-group > .col-sm-4')
      .contains('octobre 2006')
    cy.get('.from-group-lg.ng-scope > .ng-scope > .form-group > .col-sm-4')
      .contains('octobre 2016')
  })

  it('En situation de handicap ajoute choix de taux d\'incapacité', () => {
    cy.get('form').contains('En situation de handicap').click()
    cy.get('#tauxIncapaciteQuestion').should('exist')
    cy.get('.button-row').contains('Moins de 50%')
    cy.get('.button-row').contains('Entre 50% et 80%').click()
    // TODO: cannot assert this text in one shot and cannot get an ID!?
    cy.get('yes-no-question.ng-scope > .form-group > .col-sm-4')
      .contains('Avez-vous')
    cy.get('yes-no-question.ng-scope > .form-group > .col-sm-4')
      .contains('une restriction substantielle et durable d\'accès à l\'emploi reconnue par la')
    cy.get('yes-no-question.ng-scope > .form-group > .col-sm-4')
      .contains('CDAPH')
  })

  // it('TODO: tester que retraité, Inapte au travail et Enceinte ne rajoute rien sur la page', () => {
  // })

})
