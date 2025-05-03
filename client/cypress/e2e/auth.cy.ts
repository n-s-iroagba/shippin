
import { faker } from '@faker-js/faker';

describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/admin/signup').as('signupRequest');
    cy.intercept('POST', '/api/admin/login').as('loginRequest');
    cy.intercept('POST', '/api/admin/verify-email').as('verifyEmailRequest');
    cy.intercept('POST', '/api/admin/forgot-password').as('forgotPasswordRequest');
    cy.intercept('POST', '/api/admin/reset-password').as('resetPasswordRequest');
  });

  describe('Signup Flow', () => {
    const testUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'Test123456!'
    };

    it('should validate signup form inputs', () => {
      cy.visit('/admin/signup');
      
      // Test empty form submission
      cy.get('button[type="submit"]').click();
      cy.contains('Please fill in all fields').should('be.visible');
      
      // Test invalid email
      cy.get('input[name="name"]').type(testUser.name);
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('weak');
      cy.get('input[name="confirmPassword"]').type('weak');
      cy.get('button[type="submit"]').click();
      cy.contains('Please enter a valid email address').should('be.visible');
      
      // Test password mismatch
      cy.get('input[name="email"]').clear().type(testUser.email);
      cy.get('input[name="password"]').clear().type(testUser.password);
      cy.get('input[name="confirmPassword"]').clear().type('differentpass');
      cy.get('button[type="submit"]').click();
      cy.contains('Passwords do not match').should('be.visible');
    });

    it('should handle successful signup', () => {
      cy.visit('/admin/signup');
      
      cy.get('input[name="name"]').type(testUser.name);
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="confirmPassword"]').type(testUser.password);
      
      cy.get('button[type="submit"]').click();
      cy.wait('@signupRequest');
      cy.url().should('include', '/admin/verify-email');
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
    it('should handle forgot password request', () => {
      cy.visit('/admin/forgot-password');
      
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
});
