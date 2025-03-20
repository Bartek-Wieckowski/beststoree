describe('Add To Cart Button', () => {
  it('should show success toast when item is added to cart', () => {
    cy.visit('/');
    cy.getByTestId('product-card').first().click();
    cy.getByTestId('add-to-cart-button').click();
    cy.get('[role="status"]').should('exist');
  });
});
