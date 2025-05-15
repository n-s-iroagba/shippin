
import { format } from 'date-fns';

describe('Admin Journeys', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/login').as('loginRequest');
    cy.intercept('POST', '/api/signup').as('signupRequest');
    cy.intercept('GET', '/api/shipments/admin/*').as('getShipments');
    cy.intercept('POST', '/api/shipments/admin/*').as('createShipment');
    cy.intercept('POST', '/api/shippingStage/*').as('updateStatus');
    cy.intercept('DELETE', '/api/shippingStage/*').as('deleteStatus');
    cy.intercept('GET', '/api/wallets/admin').as('getWallets');
    cy.intercept('POST', '/api/wallets').as('createWallet');
    cy.intercept('DELETE', '/api/wallets/*').as('deleteWallet');
    cy.intercept('GET', '/api/shipments/pending-payments').as('getPendingPayments');
  });

  it('1. Admin Registration & Login Flow', () => {
    // Test Registration with validation
    cy.visit('/admin/signup');
    cy.get('button[type="submit"]').click();
    cy.contains('All fields are required').should('be.visible');
    
    cy.get('input[name="name"]').type('Test Admin');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('pass');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email format').should('be.visible');
    cy.contains('Password must be at least 8 characters').should('be.visible');

    // Successful registration
    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@signupRequest');
    cy.url().should('include', '/admin/dashboard');

    // Test Login validation
    cy.visit('/admin/login');
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    
    // Test invalid credentials
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid credentials').should('be.visible');

    // Successful login
    cy.get('input[name="email"]').clear().type('admin@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/admin/dashboard');
  });

  it('2. Create and Manage Shipment Flow', () => {
    cy.login('admin@example.com', 'password123');
    
    // Create new shipment with validation
    cy.visit('/admin/dashboard');
    cy.contains('Create Shipment').click();
    cy.contains('button', 'Create').click();
    cy.contains('Required fields missing').should('be.visible');
    
    const shipmentData = {
      recipientName: 'John Doe',
      recipientEmail: 'john@example.com',
      trackingNumber: 'TRK123456',
      sendingAddress: '123 Origin St',
      receivingAddress: '456 Destination Ave',
      shipmentDescription: 'Test Package Description'
    };

    Object.entries(shipmentData).forEach(([key, value]) => {
      cy.get(`input[name="${key}"]`).type(value);
    });

    cy.contains('button', 'Create').click();
    cy.wait('@createShipment');
    cy.contains('Shipment created successfully').should('be.visible');
  });

  it('3. Manage Shipment Stages', () => {
    cy.login('admin@example.com', 'password123');
    cy.visit('/admin/dashboard');
    cy.contains('View More').first().click();

    // Test stage validation
    cy.contains('Add Stage').click();
    cy.contains('button', 'Save').click();
    cy.contains('Stage name is required').should('be.visible');

    // Add payment required stage
    cy.contains('Add Stage').click();
    cy.get('input[name="stageName"]').type('Customs Clearance');
    cy.get('select[name="status"]').select('Payment Needed');
    cy.get('select[name="typeTag"]').select('Hold for Payment');
    cy.get('input[name="requiresPayment"]').check();
    cy.get('input[name="paymentAmount"]').type('500');
    cy.get('select[name="acceptedFiatOptions"]').select(['PayPal', 'Bank Transfer']);
    cy.get('textarea[name="notes"]').type('Customs fee required');
    cy.uploadFile('input[type="file"]', 'shipping-receipt.jpg');
    cy.get('button[type="submit"]').click();
    cy.wait('@updateStatus');
    cy.contains('Stage added successfully').should('be.visible');

    // Add transit stage
    cy.contains('Add Stage').click();
    cy.get('input[name="stageName"]').type('Transit to Destination');
    cy.get('select[name="status"]').select('Pending');
    cy.get('select[name="typeTag"]').select('Transit');
    cy.get('textarea[name="notes"]').type('Package in transit');
    cy.get('button[type="submit"]').click();
    cy.wait('@updateStatus');
    cy.contains('Stage added successfully').should('be.visible');

    // Verify stage list and order
    cy.get('[data-testid="stage-list"]').within(() => {
      cy.get('.stage-item').should('have.length', 2);
      cy.get('.stage-item').first().should('contain', 'Customs Clearance');
      cy.get('.stage-item').last().should('contain', 'Transit to Destination');
    });

    // Test stage visibility for receiver
    cy.visit('/track');
    cy.get('input[name="trackingNumber"]').type('TRK123456');
    cy.contains('button', 'Track').click();
    cy.get('[data-testid="current-stage"]').should('have.length', 1);
    cy.get('[data-testid="future-stages"]').should('not.exist');

    // Edit stage
    cy.visit('/admin/dashboard');
    cy.contains('View More').first().click();
    cy.contains('Edit').first().click();
    cy.get('input[name="paymentAmount"]').clear().type('600');
    cy.get('textarea[name="notes"]').clear().type('Updated customs fee');
    cy.contains('button', 'Save').click();
    cy.contains('Stage updated successfully').should('be.visible');

    // Move to next stage and delete
    cy.contains('Move to Next Stage').click();
    cy.contains('Stage updated successfully').should('be.visible');
    cy.contains('Delete').first().click();
    cy.contains('button', 'Confirm Delete').click();
    cy.wait('@deleteStatus');
    cy.contains('Stage deleted successfully').should('be.visible');
  });

  it('4. View and Handle Payments', () => {
    cy.login('admin@example.com', 'password123');
    cy.visit('/admin/pending-payments');
    cy.wait('@getPendingPayments');

    // Test filter and search
    cy.get('input[placeholder="Search by tracking number"]').type('TRK123');
    cy.get('select[name="paymentStatus"]').select('Pending');
    cy.get('table tbody tr').should('have.length.at.least', 1);

    // Review and approve payment
    cy.contains('Review').first().click();
    cy.get('img[alt="Payment Proof"]').should('be.visible');
    cy.get('[data-testid="payment-details"]').within(() => {
      cy.contains('Amount:').should('be.visible');
      cy.contains('Payment Method:').should('be.visible');
      cy.contains('Submission Date:').should('be.visible');
    });
    cy.contains('button', 'Approve').click();
    cy.contains('Payment approved').should('be.visible');
    cy.contains('Email sent to').should('be.visible');

    // Review and reject payment
    cy.contains('Review').last().click();
    cy.contains('button', 'Reject').click();
    cy.get('textarea[name="rejectionReason"]').type('Invalid payment proof');
    cy.contains('button', 'Confirm Rejection').click();
    cy.contains('Payment rejected').should('be.visible');
  });

  it('5. Manage Crypto Wallets', () => {
    cy.login('admin@example.com', 'password123');
    cy.visit('/admin/crypto-wallets');

    // Create wallet
    cy.contains('Create Wallet').click();
    cy.get('[data-testid="wallet-currency-input"]').type('BTC');
    cy.get('[data-testid="wallet-address-input"]').type('0x1234567890');
    cy.get('[data-testid="submit-button"]').click();
    cy.contains('Crypto wallet created successfully').should('be.visible');

    // Edit wallet
    cy.get('[data-testid="edit-button"]').first().click();
    cy.get('[data-testid="wallet-currency-input"]').clear().type('ETH');
    cy.get('[data-testid="submit-button"]').click();
    cy.contains('Crypto wallet updated successfully').should('be.visible');

    // Delete wallet
    cy.get('[data-testid="delete-button"]').first().click();
    cy.contains('Are you sure').should('be.visible');
    cy.contains('button', 'Yes').click();
    cy.contains('Crypto wallet deleted successfully').should('be.visible');

    // Validation
    cy.contains('Create Wallet').click();
    cy.get('[data-testid="submit-button"]').click();
    cy.contains('Currency is required').should('be.visible');
    cy.contains('Wallet address is required').should('be.visible');

    // Add wallet
    cy.contains('Add Wallet').click();
    cy.get('input[name="coinName"]').type('BTC');
    cy.get('input[name="walletAddress"]').type('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    cy.uploadFile('input[type="file"]', 'qr-code.png');
    cy.contains('button', 'Save').click();
    cy.wait('@createWallet');
    cy.contains('Wallet added successfully').should('be.visible');

    // Edit wallet
    cy.contains('Edit').first().click();
    cy.get('input[name="walletAddress"]').clear().type('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
    cy.contains('button', 'Save').click();
    cy.contains('Wallet updated successfully').should('be.visible');

    // Delete wallet
    cy.contains('Delete').first().click();
    cy.contains('button', 'Confirm').click();
    cy.wait('@deleteWallet');
    cy.contains('Wallet deleted successfully').should('be.visible');
  });

  it('6. Filter and Export Shipments', () => {
    cy.login('admin@example.com', 'password123');
    cy.visit('/admin/dashboard');
    cy.wait('@getShipments');

    // Test search and filters
    cy.get('input[placeholder*="Search"]').type('john@example.com');
    cy.get('table tbody tr').should('have.length.at.least', 1);

    cy.get('select').contains('All Statuses').parent().select('Payment Needed');
    cy.get('table tbody tr').each($row => {
      cy.wrap($row).should('contain', 'Payment Needed');
    });

    const today = format(new Date(), 'yyyy-MM-dd');
    cy.get('input[type="date"]').first().type(today);
    cy.get('input[type="date"]').last().type(today);

    // Test export functionality
    cy.contains('Export CSV').click();
    cy.contains('Export complete').should('be.visible');
  });

  it('7. Navigation and Auth Guards', () => {
    // Test unauthorized access
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/admin/login');

    // Test navigation after login
    cy.login('admin@example.com', 'password123');
    cy.visit('/admin/dashboard');
    
    // Test menu navigation
    cy.contains('Pending Payments').click();
    cy.url().should('include', '/admin/pending-payments');
    
    cy.contains('Wallets').click();
    cy.url().should('include', '/admin/wallets');

    // Test logout
    cy.contains('Logout').click();
    cy.url().should('include', '/admin/login');
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/admin/login');
  });
});
