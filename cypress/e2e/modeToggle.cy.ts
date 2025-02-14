describe('ModeToggle()', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should open theme options when clicked', () => {
    cy.getByTestId('theme-toggle').click();
    cy.getByTestId('theme-options').should('be.visible');
  });

  it('should allow user to toggle theme', () => {
    cy.get('html').then(($html) => {
      const initialTheme = $html.hasClass('dark') ? 'dark' : 'light';
      
      cy.getByTestId('theme-toggle').click();
      cy.wait(500);
      cy.contains(initialTheme === 'dark' ? 'Light' : 'Dark').click();
      cy.get('html').should('have.class', initialTheme === 'dark' ? 'light' : 'dark');
    });
  });
});

