describe('Header()', () => {
  it('should show Homepage after click on link (logo and company name text)', () => {
    cy.visit('/cart');
    cy.getByTestId('logo-link').click();
    cy.url().should('eq', Cypress.config('baseUrl'));
  });
});
