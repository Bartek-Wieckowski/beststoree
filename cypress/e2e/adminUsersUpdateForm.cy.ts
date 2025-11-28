describe("Admin Users Update Form Actions", () => {
  let testUserId: string;

  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");

    cy.task("db:createAdminUser");

    cy.task<{ id: string; email: string; name: string }>("db:createUser").then(
      (user) => {
        testUserId = user.id;
      }
    );

    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("testCypressAdmin@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();
    cy.url().should("not.include", "/sign-in");
    cy.url().should("include", "/");
    cy.getByTestId("user-button").should("be.visible");
  });

  afterEach(() => {
    cy.task("db:cleanup");
  });

  it("should update an existing user", () => {
    cy.visit("/admin/users");
    cy.url().should("include", "/admin/users");

    cy.contains("Cypress User").should("be.visible");

    // Find the edit link - ensure we get only one element
    cy.contains("tr", "Cypress User")
      .within(() => {
        cy.get('a[href*="/admin/users/"]').first().click();
      });

    cy.url().should("include", `/admin/users/${testUserId}`);

    cy.get('input[name="name"]').should("have.value", "Cypress User");
    cy.get('input[name="email"]').should(
      "have.value",
      "testCypressUser@example.com"
    );

    const updatedName = "Updated Cypress User";
    cy.get('input[name="name"]').clear().type(updatedName);

    cy.get('button[type="submit"]').first().click();

    cy.url({ timeout: 10000 }).should("include", "/admin/users");

    cy.contains("tr", "testCypressUser@example.com")
      .should("be.visible")
      .within(() => {
        cy.get("td").then(($cells) => {
          expect($cells.eq(1)).to.contain(updatedName);
        });
      });
  });
});
