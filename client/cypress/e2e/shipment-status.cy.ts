import { faker } from '@faker-js/faker';

describe('Shipment Status Management', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/shipments/*/statuses').as('createStatus');
    cy.intercept('PUT', '/api/shipments/*/statuses/*').as('updateStatus');
    cy.intercept('DELETE', '/api/shipments/*/statuses/*').as('deleteStatus');
    cy.intercept('POST', '/api/statuses/*/upload-receipt').as('uploadReceipt');
    cy.intercept('POST', '/api/statuses/*/approve-payment').as('approvePayment');
    cy.intercept('GET', '/api/payment/*').as('getPaymentDetails');
    cy.login('admin@example.com', 'password123');
  });

  describe('Create Status', () => {
    it('should create new shipment status', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Add Stage').click();

      const statusData = {
        title: 'Customs Clearance',
        description: faker.lorem.sentence(),
        location: faker.location.city(),
        status: 'In Progress',
        requiresFee: true,
        feeInDollars: 500,
        carrierNote: 'Customs clearance required'
      };

      Object.entries(statusData).forEach(([key, value]) => {
        if (key === 'requiresFee') {
          cy.get(`[name="${key}"]`).check();
        } else {
          cy.get(`[name="${key}"]`).type(value.toString());
        }
      });

      cy.get('button[type="submit"]').click();
      cy.wait('@createStatus').its('response.statusCode').should('eq', 201);
      cy.contains('Stage added successfully').should('be.visible');
    });
  });

  describe('Update Status', () => {
    it('should update status details', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Edit').first().click();

      const updates = {
        location: faker.location.city(),
        carrierNote: faker.lorem.sentence()
      };

      Object.entries(updates).forEach(([key, value]) => {
        cy.get(`[name="${key}"]`).clear().type(value);
      });

      cy.contains('Save').click();
      cy.wait('@updateStatus').its('response.statusCode').should('eq', 200);
      cy.contains('Status updated successfully').should('be.visible');
    });
  });

  describe('Payment Management', () => {
    it('should handle payment receipt upload', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      
      const fileContent = 'test receipt content';
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'receipt.jpg',
        mimeType: 'image/jpeg'
      });

      cy.contains('Upload Receipt').click();
      cy.wait('@uploadReceipt').its('response.statusCode').should('eq', 200);
      cy.contains('Receipt uploaded successfully').should('be.visible');
    });

    it('should handle payment approval', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      
      cy.contains('Review Payment').click();
      cy.wait('@getPaymentDetails').its('response.statusCode').should('eq', 200);
      
      cy.get('[data-testid="payment-details"]').should('be.visible');
      cy.contains('Approve').click();
      cy.wait('@approvePayment').its('response.statusCode').should('eq', 200);
      cy.contains('Payment approved successfully').should('be.visible');
    });
  });

  describe('Delete Status', () => {
    it('should delete status', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Delete').first().click();
      cy.contains('Confirm Delete').click();
      cy.wait('@deleteStatus').its('response.statusCode').should('eq', 200);
      cy.contains('Status deleted successfully').should('be.visible');
    });
  });
});
