describe("User Button", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should click button Sign In in Header redirect to sign-in page", () => {
    cy.getByTestId("sign-in-button").click();
    cy.url().should("include", "/sign-in");
  });

  it("should make login when user pass correct data and click button to sign in", () => {
    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("admin@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();
    cy.url().should("include", "/");
  });

  it("should logout when user have active session click user button and click button to logout", () => {
    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("admin@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();
    cy.url().should("include", "/");
    cy.getByTestId("user-button").click();
    cy.getByTestId("sign-out-button").click();
    cy.getByTestId("sign-in-button").should("be.visible");
  });
});
