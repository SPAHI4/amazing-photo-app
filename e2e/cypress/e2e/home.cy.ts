/// <reference types="Cypress" />

context('HomePage', () => {
  it('renders correctly', () => {
    cy.visit(Cypress.env('WEB_ORIGIN'));

    cy.url().should('equal', `${Cypress.env('WEB_ORIGIN')}/`);
    cy.getEl('header-login-button').should('exist');

    cy.getEl('location-link').should('exist');
  });
});
