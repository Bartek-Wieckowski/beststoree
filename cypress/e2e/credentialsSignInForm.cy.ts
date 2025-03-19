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

  it('should display email validation error when email is invalid', () => {
    cy.visit('/sign-in');

    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').type('password123');

    cy.getByTestId('sign-in-button').click();

    cy.contains('Invalid email address').should('be.visible');
  });

  it('should display password validation error when password is invalid', () => {
    cy.visit('/sign-in');

    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="password"]').clear().type('short');

    cy.getByTestId('sign-in-button').click();

    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should display sign up link', () => {
    cy.visit('/sign-in');

    cy.getByTestId('sign-in-sign-up-link').should('be.visible');
  });

  it('should navigate to sign up page when sign up link is clicked', () => {
    cy.visit('/sign-in');

    cy.getByTestId('sign-in-sign-up-link').click();

    cy.url().should('include', '/sign-up');
  });
});
