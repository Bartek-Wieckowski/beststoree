describe('CredentialsSignInForm()', () => {
  //   beforeEach(() => {
  //     cy.visit('/sign-in');
  //   });

  it('should show invalid credentials error message', () => {
    cy.visit('/sign-in');

    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="password"]').clear().type('wrongpassword');

    cy.getByTestId('sign-in-button').click();

    cy.contains('Invalid credentials').should('be.visible');
  });

  it("should button submit have 'Signing in...' text when button is clicked", () => {
    cy.visit('/sign-in', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(() => new Promise(() => {}));
      },
    });

    // cy.get('input[name="email"]').clear().type('test@example.com');
    // cy.get('input[name="password"]').clear().type('password123');

    cy.getByTestId('sign-in-button').click();

    cy.contains('Signing in...').should('be.visible');
  });
});
