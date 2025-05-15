
import { faker } from '@faker-js/faker';

describe('Information Section', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display information section correctly', () => {
    cy.get('[data-testid="info-section"]').should('be.visible');
    cy.get('[data-testid="info-title"]').should('be.visible');
    cy.get('[data-testid="info-text"]').should('be.visible');
    cy.get('[data-testid="info-images"]').should('be.visible');
  });

  it('should display all image cards with proper content', () => {
    cy.get('[data-testid="info-images"] > div').should('have.length.at.least', 1);
    cy.get('[data-testid="info-images"] img').should('be.visible');
    cy.get('[data-testid="info-images"] p').should('be.visible');
  });
});
