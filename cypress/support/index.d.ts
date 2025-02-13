declare namespace Cypress {
  interface Chainable {
    getByTestId(value: string): Chainable<JQuery<HTMLElement>>;
    // getByRole(
    //   role: string,
    //   options?: { name?: string }
    // ): Chainable<JQuery<HTMLElement>>;
  }
}
