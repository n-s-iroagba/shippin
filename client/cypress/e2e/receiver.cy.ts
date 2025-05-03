
import { faker } from '@faker-js/faker';

describe('Receiver Journeys', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/shipments/*').as('getShipment');
    cy.intercept('POST', '/api/shipments/*/payment-proof').as('submitPayment');
  });

  it('1. Access Shipment Flow', () => {
    // Visit tracking page
    cy.visit('/track');
    
    // Test invalid tracking number
    cy.get('input[placeholder*="tracking"]').type('INVALID123');
    cy.contains('button', 'Track').click();
    cy.contains('Shipment Not Found').should('be.visible');

    // Test valid tracking number
    cy.get('input[placeholder*="tracking"]').clear().type('TRK123456');
    cy.contains('button', 'Track').click();
    cy.wait('@getShipment');
    
    // Verify shipment details
    cy.contains('Shipment Details').should('be.visible');
    cy.contains('Shipment ID:').should('be.visible');
    cy.contains('Sender:').should('be.visible');
    cy.contains('Recipient:').should('be.visible');

    // Verify timeline visibility
    cy.get('[data-testid="stage-list"]').should('be.visible');
    cy.get('.stage-item').should('have.length.at.least', 1);
  });

  it('2. Handle Payment Required Stage', () => {
    // Visit shipment with payment stage
    cy.visit('/track/TRK123456');
    cy.wait('@getShipment');

    // Verify payment stage elements
    cy.contains('Payment Required').should('be.visible');
    cy.contains('button', 'Make Payment').should('be.visible');
    cy.get('[data-testid="payment-details"]').within(() => {
      cy.contains('Amount:').should('be.visible');
      cy.contains('$').should('be.visible');
    });
  });

  it('3A. Crypto Payment Flow', () => {
    cy.visit('/track/TRK123456');
    cy.wait('@getShipment');

    // Start crypto payment
    cy.contains('button', 'Make Payment').click();
    cy.contains('Pay with Crypto').click();
    cy.get('select[name="cryptoCurrency"]').select('BTC');

    // Verify crypto payment details
    cy.get('[data-testid="payment-details"]').within(() => {
      cy.get('img[alt="QR Code"]').should('be.visible');
      cy.contains('Wallet Address:').should('be.visible');
      cy.contains('Copy').click();
    });

    // Submit payment proof
    cy.contains('Upload Payment Proof').click();
    cy.get('input[type="file"]').attachFile('payment-proof.jpg');
    cy.contains('button', 'Submit').click();
    cy.wait('@submitPayment');
    cy.contains('Payment submitted. Admin will verify.').should('be.visible');
  });

  it('3B. Fiat Payment Flow', () => {
    cy.visit('/track/TRK123456');
    cy.wait('@getShipment');

    // Start fiat payment
    cy.contains('button', 'Make Payment').click();
    cy.contains('Pay with Fiat').click();

    // Test payment method selection
    cy.get('select[name="fiatMethod"]').should('exist');
    cy.get('select[name="fiatMethod"]').select('PayPal');
    
    // Verify redirection to WhatsApp
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.contains('button', 'Continue to Payment').click();
    cy.get('@windowOpen').should('be.calledWith', 
      Cypress.sinon.match(/https:\/\/wa\.me\//)
    );
  });

  it('4. Verify Stage Visibility Rules', () => {
    cy.visit('/track/TRK123456');
    cy.wait('@getShipment');

    // Should only see completed stages and current stage
    cy.get('[data-testid="completed-stages"]').should('be.visible');
    cy.get('[data-testid="current-stage"]').should('have.length', 1);
    cy.get('[data-testid="future-stages"]').should('not.exist');

    // Verify stage details visibility
    cy.get('.stage-item').first().within(() => {
      cy.get('[data-testid="stage-date"]').should('be.visible');
      cy.get('[data-testid="stage-tag"]').should('be.visible');
      cy.get('[data-testid="stage-status"]').should('be.visible');
    });
  });
});
