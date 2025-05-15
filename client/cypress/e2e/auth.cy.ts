 describe('Signup Flow', () => {
    const testUser = {
      name: 'Nnamdi Solomon Iroagba',
      email: 'nnamdisolomon1@gmail.com',
      password: 'Test123456!'
    };

    it.only('should validate signup form inputs', () => {
    cy.visit('http://localhost:3001/admin/signup');

    cy.get('[data-cy="name"]').type(testUser.name);
    cy.get('[data-cy="email"]').type(testUser.email);
    cy.get('[data-cy="password"]').type('securePassword123');
    cy.get('[data-cy="confirm-password"]').type('securePassword123');
    cy.get('[data-cy="submit"]').click();
    cy.url().should('include', '/admin/verify-email');
  });

  it('shows an error if passwords do not match', () => {
    cy.visit('/admin/signup');

    cy.get('[data-cy="name"]').type('Mismatch Tester');
    cy.get('[data-cy="email"]').type('mismatch@example.com');
    cy.get('[data-cy="password"]').type('12345678');
    cy.get('[data-cy="confirm-password"]').type('wrongpassword');
    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="error-message"]').should('contain', 'Passwords do not match');
  });
});

  describe('Email Verification Flow', () => {
    it('should handle verification code input', () => {
      cy.visit('/admin/verify-email/test-token');
      
      // Test invalid code
      cy.get('input[type="text"]').type('12345');
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid verification code').should('be.visible');
      
      // Test resend functionality
      cy.wait(180000); // Wait for resend timer
      cy.contains('Resend Code').should('be.visible').click();
      cy.contains('New verification code has been sent').should('be.visible');
    });
  });

  describe('Login Flow', () => {
    it('should validate login form', () => {
      cy.visit('/admin/login');
      
      // Test empty form
      cy.get('button[type="submit"]').click();
      cy.contains('Please fill in all fields').should('be.visible');
      
      // Test invalid credentials
      cy.get('input[name="email"]').type('wrong@email.com');
      cy.get('input[name="password"]').type('wrongpass');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginRequest');
      cy.contains('Incorrect email or password').should('be.visible');
    });

    it('should handle successful login', () => {
      cy.visit('/admin/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginRequest');
      cy.url().should('include', '/admin/dashboard');
    });
  });

  describe('Password Reset Flow', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/admin/forgot-password').as('forgotPasswordRequest');
      cy.intercept('POST', '/api/admin/reset-password/*').as('resetPasswordRequest');
      cy.intercept('GET', '/api/admin/validate-reset-token/*').as('validateTokenRequest');
    });

    it('should handle forgot password request', () => {
   cy.visit('http://localhost:3001/admin/signup');

      
      // Test invalid email
      cy.get('input[type="email"]').type('invalid@email');
      cy.get('button[type="submit"]').click();
      cy.contains('No admin account found').should('be.visible');
      
      // Test valid email
      cy.get('input[type="email"]').clear().type('test@example.com');
      cy.get('button[type="submit"]').click();
      cy.wait('@forgotPasswordRequest');
      cy.contains('Password reset link has been sent').should('be.visible');
    });

    it('should handle password reset', () => {
      cy.visit('/admin/reset-password/test-token');
      
      // Test password validation
      cy.get('input[name="password"]').type('weak');
      cy.get('input[name="confirmPassword"]').type('weak');
      cy.get('button[type="submit"]').click();
      cy.contains('Password must be at least 8 characters').should('be.visible');
      
      // Test successful reset
      cy.get('input[name="password"]').clear().type('NewPassword123!');
      cy.get('input[name="confirmPassword"]').clear().type('NewPassword123!');
      cy.get('button[type="submit"]').click();
      cy.wait('@resetPasswordRequest');
      cy.url().should('include', '/admin/login');
    });
  });
