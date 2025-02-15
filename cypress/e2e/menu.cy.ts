describe('Menu() in mobile view', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
    cy.visit('/');
  });

  it('should show menu when clicking on the menu trigger button on mobile device', () => {
    cy.getByTestId('sheet-menu-trigger').click();
    cy.getByTestId('theme-toggle').should('be.visible');
  });

  it('should show x icon with class sr-only when menu is open', () => {
    cy.getByTestId('sheet-menu-trigger').click();
    cy.get('button[data-state="open"]')
      .should('exist')
      .within(() => {
        cy.get('svg').should('exist');
      });
  });

  it('should hide menu when click on the x icon', () => {
    cy.getByTestId('sheet-menu-trigger').click();
    cy.get('button[data-state="open"]').should(($btn) => {
      if (!$btn.hasClass('disabled:pointer-events-none')) {
        $btn.trigger('click');
      }
    });
    cy.get('div[role="dialog"]').should('not.exist');
  });

  it('should hide menu when user click outside div with role dialog when its open', () => {
    cy.getByTestId('sheet-menu-trigger').click();
    cy.get('div[role="dialog"]').should('exist');
    cy.get('div[data-state="open"]').first().click();
    cy.get('div[role="dialog"]').should('not.exist');
  });
});

describe('Menu() in desktop view', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should change route to /cart when clicking on cart button', () => {
    cy.getByTestId('cart-button').click();
    // cy.url().should('include', '/cart');
    cy.url().should('eq', Cypress.config('baseUrl') + 'cart');
  });
});
