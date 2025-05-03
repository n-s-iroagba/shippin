
import { faker } from '@faker-js/faker';

describe('Shipment Status Management', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/shipments/*/statuses').as('createStatus');
    cy.intercept('PUT', '/api/shipments/*/statuses/*').as('updateStatus');
    cy.intercept('DELETE', '/api/shipments/*/statuses/*').as('deleteStatus');
    cy.intercept('POST', '/api/statuses/*/upload-receipt').as('uploadReceipt');
    cy.login('admin@example.com', 'password123');
  });

  it('should add new shipment status', () => {
    cy.visit('/admin/dashboard');
    cy.contains('View More').first().click();
    cy.contains('Add Stage').click();

    // Fill status form
    cy.get('input[name="title"]').type('Customs Clearance');
    cy.get('select[name="paymentStatus"]').select('YET_TO_BE_PAID');
    cy.get('input[name="requiresFee"]').check();
    cy.get('input[name="feeInDollars"]').type('500');
    cy.get('textarea[name="carrierNote"]').type('Customs clearance required');

    cy.get('button[type="submit"]').click();
    cy.wait('@createStatus');
    cy.contains('Stage added successfully').should('be.visible');
  });

  it('should handle payment receipt upload', () => {
    cy.visit('/admin/dashboard');
    cy.contains('View More').first().click();
    
    // Upload receipt
    cy.get('input[type="file"]').attachFile('test-receipt.jpg');
    cy.contains('Upload Receipt').click();
    cy.wait('@uploadReceipt');
    cy.contains('Receipt uploaded successfully').should('be.visible');
  });

  it('should manage payment approval', () => {
    cy.visit('/admin/dashboard');
    cy.contains('View More').first().click();
    
    // Review and approve payment
    cy.contains('Review Payment').click();
    cy.get('[data-testid="payment-details"]').should('be.visible');
    cy.contains('button', 'Approve').click();
    cy.contains('Payment approved successfully').should('be.visible');
  });
});
