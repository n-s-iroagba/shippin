
import { format } from 'date-fns';

describe('Fiat Platform Management', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/admin/fiat-platforms').as('listPlatforms');
    cy.intercept('POST', '/api/admin/fiat-platforms').as('createPlatform');
    cy.intercept('PUT', '/api/admin/fiat-platforms/*').as('updatePlatform');
    cy.intercept('DELETE', '/api/admin/fiat-platforms/*').as('deletePlatform');
    
    // Login before each test
    cy.login('admin@example.com', 'password123');
  });

  it('should display fiat platforms list', () => {
    cy.visit('/admin/fiat-platforms');
    cy.wait('@listPlatforms');
    
    // Verify page elements
    cy.contains('h1', 'Fiat Platforms').should('be.visible');
    cy.contains('button', 'Create Platform').should('be.visible');
  });

  it('should create new fiat platform with validation', () => {
    cy.visit('/admin/fiat-platforms');
    cy.contains('Create Platform').click();

    // Test validation
    cy.contains('button', 'Create').click();
    cy.contains('Name is required').should('be.visible');
    cy.contains('Base URL is required').should('be.visible');
    cy.contains('Message template is required').should('be.visible');

    // Fill form with valid data
    cy.get('input[name="name"]').type('PayPal');
    cy.get('input[name="baseUrl"]').type('https://paypal.com');
    cy.get('textarea[name="messageTemplate"]').type('Paying {amount} for status {statusId}');
    cy.contains('button', 'Create').click();

    cy.wait('@createPlatform');
    cy.contains('Fiat platform created successfully').should('be.visible');
    cy.contains('PayPal').should('be.visible');
  });

  it('should edit existing fiat platform', () => {
    cy.visit('/admin/fiat-platforms');
    cy.wait('@listPlatforms');

    // Click edit on first platform
    cy.contains('button', 'Edit').first().click();

    // Update form data
    cy.get('input[name="name"]').clear().type('Updated PayPal');
    cy.get('input[name="baseUrl"]').clear().type('https://paypal.com/updated');
    cy.contains('button', 'Update').click();

    cy.wait('@updatePlatform');
    cy.contains('Fiat platform updated successfully').should('be.visible');
    cy.contains('Updated PayPal').should('be.visible');
  });

  it('should handle edit errors appropriately', () => {
    cy.visit('/admin/fiat-platforms');
    cy.wait('@listPlatforms');

    cy.contains('button', 'Edit').first().click();
    cy.get('input[name="name"]').clear();
    cy.contains('button', 'Update').click();
    cy.contains('Name is required').should('be.visible');
  });

  it('should delete fiat platform', () => {
    cy.visit('/admin/fiat-platforms');
    cy.wait('@listPlatforms');

    // Confirm deletion
    cy.contains('button', 'Delete').first().click();
    cy.on('window:confirm', () => true);

    cy.wait('@deletePlatform');
    cy.contains('Fiat platform deleted successfully').should('be.visible');
  });
});
