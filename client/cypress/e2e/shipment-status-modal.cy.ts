
import { faker } from '@faker-js/faker';

describe('ShipmentStatusModal Operations', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/admin/shipment-details/*/statuses').as('createStatus');
    cy.intercept('PUT', '/api/admin/shipment-details/*/statuses/*').as('updateStatus');
    cy.intercept('DELETE', '/api/admin/shipment-details/*/statuses/*').as('deleteStatus');
    cy.login('admin@example.com', 'password123');
  });

  it('should create a new shipment status', () => {
    cy.visit('/admin/shipments');
    cy.contains('View').first().click();
    cy.contains('Add Shipment Status').click();

    // Fill in the form
    const statusData = {
      title: faker.commerce.productName(),
      carrierNote: faker.lorem.sentence(),
      dateAndTime: '2024-01-20',
      requiresFee: true,
      feeInDollars: '500',
      percentageNote: '10',
      supportingDocument: faker.internet.url()
    };

    cy.get('input[name="title"]').type(statusData.title);
    cy.get('textarea[name="carrierNote"]').type(statusData.carrierNote);
    cy.get('input[name="dateAndTime"]').type(statusData.dateAndTime);
    cy.get('input[name="requiresFee"]').check();
    cy.get('input[name="feeInDollars"]').type(statusData.feeInDollars);
    cy.get('input[name="percentageNote"]').type(statusData.percentageNote);
    cy.get('input[name="supportingDocument"]').type(statusData.supportingDocument);

    cy.contains('button', 'Save').click();
    cy.wait('@createStatus');
    cy.contains(statusData.title).should('be.visible');
  });

  it('should update an existing shipment status', () => {
    cy.visit('/admin/shipments');
    cy.contains('View').first().click();
    cy.contains('Edit').first().click();

    const updatedData = {
      title: faker.commerce.productName(),
      carrierNote: faker.lorem.sentence()
    };

    cy.get('input[name="title"]').clear().type(updatedData.title);
    cy.get('input[name="carrierNote"]').clear().type(updatedData.carrierNote);

    cy.contains('button', 'Save').click();
    cy.wait('@updateStatus');
    cy.contains(updatedData.title).should('be.visible');
  });

  it('should delete a shipment status', () => {
    cy.visit('/admin/shipments');
    cy.contains('View').first().click();

    // Store the title of the status we're going to delete
    cy.get('[data-testid="status-list"]').first().invoke('text').as('statusTitle');

    cy.contains('Delete').first().click();
    cy.contains('button', 'Confirm Delete').click();
    cy.wait('@deleteStatus');

    // Verify the status is no longer visible
    cy.get('@statusTitle').then((statusTitle) => {
      cy.contains(statusTitle).should('not.exist');
    });
  });

  it('should handle form validation when creating status', () => {
    cy.visit('/admin/shipments');
    cy.contains('View').first().click();
    cy.contains('Add Shipment Status').click();

    // Try to submit without required fields
    cy.contains('button', 'Save').click();
    cy.contains('Title is required').should('be.visible');

    // Fill only required fields
    cy.get('input[name="title"]').type('Test Status');
    cy.contains('button', 'Save').click();
    cy.wait('@createStatus');
    cy.contains('Test Status').should('be.visible');
  });
});
