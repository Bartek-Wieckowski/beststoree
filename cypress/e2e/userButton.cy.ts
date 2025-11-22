describe("User Button", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");
  });

  afterEach(() => {
    cy.task("db:cleanup");
  });

  it("should click button Sign In in Header redirect to sign-in page", () => {
    cy.visit("/");
    cy.getByTestId("sign-in-button").click();
    cy.url().should("include", "/sign-in");
  });

  it("should make login when user pass correct data and click button to sign in", () => {
    cy.task("db:createAdminUser");
    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("testCypressAdmin@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();
    cy.url().should("not.include", "/sign-in");
    cy.url().should("include", "/");
    cy.getByTestId("user-button").should("be.visible");
  });

  it("should logout when user have active session click user button and click button to logout", () => {
    cy.task("db:createAdminUser");
    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("testCypressAdmin@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();
    cy.url().should("not.include", "/sign-in");
    cy.url().should("include", "/");
    cy.getByTestId("user-button").should("be.visible");
    cy.getByTestId("user-button").click();
    cy.getByTestId("sign-out-button").click();
    cy.getByTestId("sign-in-button").should("be.visible");
  });
});
