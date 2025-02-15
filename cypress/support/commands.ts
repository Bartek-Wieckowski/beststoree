Cypress.Commands.add('getByTestId', (selector: string) => {
  return cy.get(`[data-testid="${selector}"]`)
})

// Cypress.Commands.add('getByRole', (role: string, options?: { name?: string }) => {
//   if (options?.name) {
//     return cy.get(`[role="${role}"][name="${options.name}"]`)
//   }
//   return cy.get(`[role="${role}"]`)
// })


