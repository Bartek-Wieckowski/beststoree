describe("Admin Product Form Actions", () => {
  let testProductId: string;
  //   let testProductName: string;

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
    // Clean up test products by name (more reliable than by ID)
    // if (testProductName) {
    //   cy.task("db:deleteTestProductsByName", testProductName);
    // }
    // Also clean up by ID if available
    if (testProductId) {
      cy.task("db:deleteTestProduct", testProductId);
    }
    // Clean up any remaining test products
    cy.task("db:deleteTestProductsByName", "Test Product");
    cy.task("db:cleanup");
  });

  //   it("should create a new product", () => {
  //     // Mock uploadthing endpoint to prevent actual uploads
  //     cy.intercept("POST", "**/api/uploadthing/**", {
  //       statusCode: 200,
  //       body: [{ url: "/images/sample-products/p1-1.jpg", key: "test-key" }],
  //     }).as("mockUpload");

  //     // Navigate to admin products page
  //     cy.visit("/admin/products");
  //     cy.url().should("include", "/admin/products");

  //     // Click create product button
  //     cy.get('[data-testid="create-product-button"]').click();
  //     cy.url().should("include", "/admin/products/create");

  //     // Fill in the form
  //     const productName = `Test Product ${Date.now()}`;
  //     testProductName = "Test Product"; // Store for cleanup
  //     const productSlug = `test-product-${Date.now()}`;

  //     cy.get('input[name="name"]').clear().type(productName);
  //     cy.get('input[name="slug"]').clear().type(productSlug);
  //     cy.get('input[name="category"]').clear().type("Test Category");
  //     cy.get('input[name="brand"]').clear().type("Test Brand");
  //     cy.get('input[name="price"]').clear().type("29.99");
  //     cy.get('input[name="stock"]').clear().type("10");
  //     cy.get('textarea[name="description"]')
  //       .clear()
  //       .type("This is a test product description");

  //     // Set images using custom command to bypass uploadthing
  //     // This simulates the upload by directly setting the form value
  //     cy.setReactHookFormValue("images", ["/images/sample-products/p1-1.jpg"]);

  //     // Wait a bit for form state to update and verify image was set
  //     cy.wait(300);
  //     cy.get('img[alt="product image"]', { timeout: 2000 }).should("be.visible");

  //     // Submit the form
  //     cy.get('button[type="submit"]').click();

  //     // Wait for redirect to products page
  //     cy.url({ timeout: 10000 }).should("include", "/admin/products");

  //     // Verify product was created by checking if it appears in the list
  //     cy.contains(productName).should("be.visible");

  //     // Get the product ID from the edit link and store it for cleanup
  //     cy.contains("tr", productName)
  //       .find('a[href*="/admin/products/"]')
  //       .first()
  //       .invoke("attr", "href")
  //       .then((href) => {
  //         if (href) {
  //           const match = href.match(/\/admin\/products\/([a-zA-Z0-9-]+)/);
  //           if (match && match[1]) {
  //             testProductId = match[1];
  //           }
  //         }
  //       });
  //   });

  it("should update an existing product", () => {
    // First create a test product
    cy.task<{ id: string; slug: string; name: string }>(
      "db:createTestProduct"
    ).then((product) => {
      testProductId = product.id;

      // Navigate to edit page
      cy.visit(`/admin/products/${testProductId}`);
      cy.url().should("include", `/admin/products/${testProductId}`);

      // Verify form is loaded with product data
      cy.get('input[name="name"]').should("have.value", product.name);

      // Update the product name
      const updatedName = `Updated Test Product ${Date.now()}`;
      cy.get('input[name="name"]').clear().type(updatedName);

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for redirect to products page
      cy.url({ timeout: 10000 }).should("include", "/admin/products");

      // Verify product was updated
      cy.contains(updatedName).should("be.visible");
      cy.contains(product.name).should("not.exist");
    });
  });
});
