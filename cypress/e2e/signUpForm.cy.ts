describe('Sign Up Form', () => {
  //   beforeEach(() => {
  //     cy.visit('/sign-up');
  //   });

  it('should display errors when form is submitted with invalid data', () => {
    cy.visit('/sign-up');

    cy.getByTestId('sign-up-button').click();

    cy.contains('Invalid email address').should('be.visible');
  });

  it("should button submit have 'Submitting...' text when button is clicked", () => {
    cy.visit('/sign-up', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(() => new Promise(() => {}));
      },
    });

    cy.getByTestId('sign-up-button').click();

    cy.contains('Submitting...').should('be.visible');
  });

  it('should display sign in link', () => {
    cy.visit('/sign-up');

    cy.getByTestId('sign-up-sign-in-link').should('be.visible');
  });

  it('should navigate to sign in page when sign in link is clicked', () => {
    cy.visit('/sign-up');

    cy.getByTestId('sign-up-sign-in-link').click();

    cy.url().should('include', '/sign-in');
  });
});
