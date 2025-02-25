describe('ProductCard()', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should redirect to page with slug when image is clicked', () => {
    cy.getByTestId('product-card').first().click();
    cy.url().should('include', '/product/');
  });
});
