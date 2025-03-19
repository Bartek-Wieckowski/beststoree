describe('Sign In Page', () => {
  beforeEach(() => {
    cy.visit('/sign-in');
  });

  it('should display title and description inside page', () => {
    cy.getByTestId('sign-in-title')
      .should('be.visible')
      .and('have.text', 'Sign In');
    cy.getByTestId('sign-in-description').should('be.visible');
  });

  it('should displays the sign in form with all required elements', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.getByTestId('sign-in-button').should('be.visible');
  });
});
