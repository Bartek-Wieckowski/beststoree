describe('Not Found Page', () => {
  it('should show 404 page for non-existent routes', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false });

    cy.getByTestId('not-found-heading').should('be.visible');

    cy.getByTestId('back-to-home').click();
    cy.url().should('eq', Cypress.config('baseUrl'));
  });
});
