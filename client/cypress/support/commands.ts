
declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>
    uploadFile(selector: string, fileName: string): Chainable<void>
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/admin/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/admin/dashboard');
});

Cypress.Commands.add('uploadFile', (selector: string, fileName: string) => {
  cy.get(selector).attachFile(fileName);
});

import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      uploadFile(selector: string, fileName: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/admin/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/admin/dashboard');
});

// Add custom command for file upload
Cypress.Commands.add('uploadFile', (selector: string, fileName: string) => {
  cy.get(selector).attachFile(fileName);
});