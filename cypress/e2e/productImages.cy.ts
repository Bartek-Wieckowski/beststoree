describe('ProductImages()', () => {
  beforeEach(() => {
    cy.visit("/")
    cy.getByTestId('product-card').first().click();
  });

  it('should thumbnail have active class when clicked', () => {
    cy.getByTestId('product-image-thumbnail')
      .first()
      .parent()
      .click()
      .should('have.class', 'border-orange-500');
  });

  it('should main image change when thumbnail is clicked', () => {
    cy.getByTestId('product-image-main')
      .invoke('attr', 'src')
      .then((initialSrc) => {
        cy.getByTestId('product-image-thumbnail')
          .eq(1)
          .parent()
          .click();
        
        cy.getByTestId('product-image-main')
          .should('have.attr', 'src')
          .and('not.equal', initialSrc);
      });
  });
});

