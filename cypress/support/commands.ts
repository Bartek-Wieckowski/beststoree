import { TestCypressUser } from '@/types';

Cypress.Commands.add('getByTestId', (selector: string) => {
  return cy.get(`[data-testid="${selector}"]`);
});

// Cypress.Commands.add('getByRole', (role: string, options?: { name?: string }) => {
//   if (options?.name) {
//     return cy.get(`[role="${role}"][name="${options.name}"]`)
//   }
//   return cy.get(`[role="${role}"]`)
// })

Cypress.Commands.add('login', () => {
  cy.task<TestCypressUser>('db:createUser').then((user) => {
    const sessionToken = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    cy.setCookie('authjs.session-token', JSON.stringify(sessionToken), {
      httpOnly: true,
      secure: false, // false dla localhost
      sameSite: 'lax',
    });

    cy.reload();
  });
});
