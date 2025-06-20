import 'cypress-file-upload';


Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/admin/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/admin/dashboard');
});
