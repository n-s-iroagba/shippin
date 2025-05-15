import { faker } from '@faker-js/faker';

describe('Shipment Management', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/admin/shipments').as('createShipment');
    cy.intercept('GET', '/api/admin/shipments').as('getShipments');
    cy.intercept('GET', '/api/admin/shipments/*').as('getShipmentDetails');
    cy.intercept('PUT', '/api/admin/shipments/*').as('updateShipment');
    cy.intercept('DELETE', '/api/admin/shipments/*').as('deleteShipment');
    cy.intercept('POST', '/api/shipments/*/statuses').as('createStatus');
    cy.intercept('PUT', '/api/shipments/*/statuses/*').as('updateStatus');
    cy.intercept('DELETE', '/api/shipments/*/statuses/*').as('deleteStatus');

    cy.login('admin@example.com', 'password123');
  });

  describe('Create Shipment', () => {
    it('should create a new shipment successfully', () => {
      cy.visit('/admin/dashboard');
      cy.contains('Create Shipment').click();

      const shipmentData = {
        shipmentID: `SHP${faker.string.alphanumeric(8).toUpperCase()}`,
        senderName: faker.person.fullName(),
        sendingPickupPoint: faker.location.streetAddress(),
        shippingTakeoffAddress: faker.location.streetAddress(),
        receivingAddress: faker.location.streetAddress(),
        recipientName: faker.person.fullName(),
        shipmentDescription: faker.lorem.sentence(),
        expectedTimeOfArrival: faker.date.future().toISOString().split('T')[0],
        freightType: 'AIR',
        weight: faker.number.int({ min: 1, max: 100 }),
        dimensionInInches: '10x10x10',
        receipientEmail: faker.internet.email()
      };

      // Fill form fields
      Object.entries(shipmentData).forEach(([key, value]) => {
        if (key === 'freightType') {
          cy.get(`select[name="${key}"]`).select(value);
        } else {
          cy.get(`[name="${key}"]`).type(value.toString());
        }
      });

      cy.get('button[type="submit"]').click();
      cy.wait('@createShipment').its('response.statusCode').should('eq', 201);
      cy.contains('Shipment created successfully').should('be.visible');
    });

    it('should show validation errors for invalid input', () => {
      cy.visit('/admin/dashboard');
      cy.contains('Create Shipment').click();
      cy.get('button[type="submit"]').click();
      cy.contains('Please correct the form fields').should('be.visible');
    });
  });

  describe('List Shipments', () => {
    it('should display shipments list', () => {
      cy.visit('/admin/shipments');
      cy.wait('@getShipments').its('response.statusCode').should('eq', 200);
      cy.get('table tbody tr').should('have.length.at.least', 1);
    });

    it('should handle failed shipments fetch', () => {
      cy.intercept('GET', '/api/admin/shipments', {
        statusCode: 500,
        body: { message: 'Failed to fetch shipments' }
      }).as('failedFetch');

      cy.visit('/admin/shipments');
      cy.wait('@failedFetch');
      cy.contains('Unable to fetch shipments').should('be.visible');
    });
  });

  describe('View and Update Shipment', () => {
    it('should display shipment details', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.wait('@getShipmentDetails').its('response.statusCode').should('eq', 200);
      cy.get('[data-testid="shipment-details"]').should('be.visible');
    });

    it('should update shipment details', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Edit Shipment').click();

      const updates = {
        recipientName: faker.person.fullName(),
        receivingAddress: faker.location.streetAddress()
      };

      Object.entries(updates).forEach(([key, value]) => {
        cy.get(`[name="${key}"]`).clear().type(value);
      });

      cy.contains('Save Changes').click();
      cy.wait('@updateShipment').its('response.statusCode').should('eq', 200);
      cy.contains('Shipment updated successfully').should('be.visible');
    });
  });

  describe('Delete Shipment', () => {
    it('should delete shipment', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Delete Shipment').click();
      cy.contains('Confirm Delete').click();
      cy.wait('@deleteShipment').its('response.statusCode').should('eq', 200);
      cy.contains('Shipment deleted successfully').should('be.visible');
    });
  });
});