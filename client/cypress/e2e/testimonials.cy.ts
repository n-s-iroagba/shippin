
describe('Testimonial Carousel', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display testimonial carousel', () => {
    cy.get('[data-testid="testimonial-carousel"]').should('be.visible');
    cy.get('[data-testid="testimonial-slide"]').should('be.visible');
  });

  it('should navigate through testimonials', () => {
    cy.get('[data-testid="next-button"]').click();
    cy.get('[data-testid="testimonial-slide"]').should('have.length.at.least', 1);
    
    cy.get('[data-testid="prev-button"]').click();
    cy.get('[data-testid="testimonial-slide"]').should('have.length.at.least', 1);
  });
});
