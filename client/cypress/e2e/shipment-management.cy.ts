
import { faker } from '@faker-js/faker';

describe('Shipment Management', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/admin/shipment-details').as('createShipment');
    cy.intercept('GET', '/api/admin/shipment-details').as('getShipments');
    cy.intercept('GET', '/api/admin/shipment-details/*').as('getShipmentDetails');
    cy.intercept('PUT', '/api/admin/shipment-details/*').as('updateShipment');
    cy.intercept('DELETE', '/api/admin/shipment-details/*').as('deleteShipment');
    cy.intercept('POST', '/api/admin/shipment-details/*/statuses').as('createStatus');
    cy.intercept('PUT', '/api/admin/shipment-details/*/statuses/*').as('updateStatus');
    cy.intercept('DELETE', '/api/admin/shipment-details/*/statuses/*').as('deleteStatus');
    
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
      cy.wait('@createShipment');
      cy.contains('Shipment created successfully').should('be.visible');
      cy.url().should('include', '/admin/shipments');
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
      cy.wait('@getShipments');
      
      cy.get('table tbody tr').should('have.length.at.least', 1);
      cy.get('table').should('contain', 'Shipment ID')
        .and('contain', 'Sender Name')
        .and('contain', 'Recipient Name')
        .and('contain', 'Receiving Address')
        .and('contain', 'Freight Type')
        .and('contain', 'Expected Arrival');
    });

    it('should handle failed shipments fetch', () => {
      cy.intercept('GET', '/api/admin/shipment-details', {
        statusCode: 500,
        body: { message: 'Failed to fetch shipments' }
      });
      
      cy.visit('/admin/shipments');
      cy.contains('Unable to fetch shipments. Please try again later').should('be.visible');
    });
  });

  describe('View and Manage Shipment Details', () => {
    it('should display shipment details and statuses', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.wait('@getShipmentDetails');
      
      cy.get('[data-testid="shipment-details"]').should('be.visible');
      cy.get('[data-testid="status-list"]').should('be.visible');
      cy.contains('Create Status').should('be.visible');
    });

    it('should create a new status', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Create Status').click();

      const statusData = {
        title: 'Customs Clearance',
        description: faker.lorem.sentence(),
        location: faker.location.city(),
        status: 'In Progress',
        feeInDollars: 500
      };

      Object.entries(statusData).forEach(([key, value]) => {
        cy.get(`[name="${key}"]`).type(value.toString());
      });

      cy.get('button[type="submit"]').click();
      cy.wait('@createStatus');
      cy.contains('Status created successfully').should('be.visible');
    });

    it('should update status', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Edit').first().click();

      cy.get('input[name="location"]').clear().type('New Location');
      cy.contains('button', 'Save').click();
      cy.wait('@updateStatus');
      cy.contains('Status updated successfully').should('be.visible');
    });

    it('should delete status', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Delete').first().click();
      cy.contains('button', 'Confirm Delete').click();
      cy.wait('@deleteStatus');
      cy.contains('Status deleted successfully').should('be.visible');
    });
  });

  describe('Update Shipment', () => {
    it('should update shipment details', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Edit Shipment').click();

      const newData = {
        recipientName: faker.person.fullName(),
        receivingAddress: faker.location.streetAddress()
      };

      Object.entries(newData).forEach(([key, value]) => {
        cy.get(`[name="${key}"]`).clear().type(value);
      });

      cy.contains('button', 'Save Changes').click();
      cy.wait('@updateShipment');
      cy.contains('Shipment updated successfully').should('be.visible');
    });
  });

  describe('Delete Shipment', () => {
    it('should delete shipment and redirect', () => {
      cy.visit('/admin/shipments');
      cy.contains('View').first().click();
      cy.contains('Delete Shipment').click();
      cy.contains('button', 'Confirm Delete').click();
      cy.wait('@deleteShipment');
      cy.contains('Shipment deleted successfully').should('be.visible');
      cy.url().should('include', '/admin/shipments');
    });
  });
});
