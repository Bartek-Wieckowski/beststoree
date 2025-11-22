describe("Admin Products Page", () => {
  let testProductId: string;

  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");

    cy.task("db:createAdminUser");

    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("testCypressAdmin@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();
    cy.url().should("not.include", "/sign-in");
    cy.url().should("include", "/");
    cy.getByTestId("user-button").should("be.visible");
  });

  afterEach(() => {
    // Clean up test product if it was created
    if (testProductId) {
      cy.task("db:deleteTestProduct", testProductId);
    }
    cy.task("db:cleanup");
  });

  it("should display products list", () => {
    // Navigate to admin products page
    cy.visit("/admin/products");
    cy.url().should("include", "/admin/products");

    // Verify page elements are visible
    cy.contains("Products").should("be.visible");
    cy.get('[data-testid="create-product-button"]').should("be.visible");
    cy.contains("ID").should("be.visible");
    cy.contains("Name").should("be.visible");
    cy.contains("Price").should("be.visible");
    cy.contains("Category").should("be.visible");
    cy.contains("Stock").should("be.visible");
    cy.contains("Rating").should("be.visible");
    cy.contains("Actions").should("be.visible");

    // Verify products table is displayed
    cy.get("table").should("be.visible");
    cy.get("tbody tr").should("have.length.at.least", 1);
  });

  it("should allow admin to delete a product", () => {
    // Create a test product
    cy.task<{ id: string; slug: string; name: string }>(
      "db:createTestProduct"
    ).then((product) => {
      testProductId = product.id;

      // Navigate to admin products page
      cy.visit("/admin/products");
      cy.url().should("include", "/admin/products");

      // Verify the test product is visible in the table
      cy.contains("Test Product for Cypress").should("be.visible");

      // Find the row with the test product and get the delete button
      cy.contains("tr", "Test Product for Cypress").within(() => {
        cy.contains("button", "Delete").should("be.visible").click();
      });

      // Verify delete dialog is shown
      cy.contains("Are you absolutely sure?").should("be.visible");
      cy.contains("This action cannot be undone").should("be.visible");
      cy.contains("Cancel").should("be.visible");

      // Find and click the confirm delete button in the dialog
      cy.get('[role="alertdialog"]').within(() => {
        cy.contains("button", "Delete").should("be.visible").click();
      });

      // Wait for deletion to complete
      cy.contains("Test Product for Cypress", { timeout: 5000 }).should(
        "not.exist"
      );

      // Verify success toast is shown
      cy.contains("Product deleted successfully").should("be.visible");

      // Clear testProductId so it won't be deleted again in afterEach
      testProductId = "";
    });
  });
});
