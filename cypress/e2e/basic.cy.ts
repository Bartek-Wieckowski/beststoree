describe('Basic test', () => {
  it('should visit homepage', () => {
    cy.visit('/')
    cy.get('body').should('be.visible')
  })
}) 