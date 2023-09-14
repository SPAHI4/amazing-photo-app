/// <reference types="Cypress" />

import Chainable = Cypress.Chainable;

function getEl(cyName: string): Chainable<JQuery<HTMLElement>> {
  return cy.get(`[data-test=${cyName}]`);
}

Cypress.Commands.add('getEl', getEl);

export {}; // Make this a module so we can `declare global`

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getEl: typeof getEl;
      // serverCommand: typeof serverCommand;
      // login: typeof login;
    }
  }
}
