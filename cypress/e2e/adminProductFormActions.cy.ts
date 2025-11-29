describe("Admin Product Form Actions", () => {
  let testProductId: string;
  let uploadedImageKeys: string[] = [];

  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");

    cy.task("db:createAdminUser");

    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("testCypressAdmin@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();

    // Wait for redirect after login
    cy.url().should("not.include", "/sign-in");
    cy.url().should("include", "/");

    // Reload page to ensure session is properly set
    cy.reload();

    // Wait for page to fully load - check for header first
    cy.get("header", { timeout: 15000 }).should("be.visible");

    // Verify sign-in button is gone (user is logged in)
    cy.getByTestId("sign-in-button").should("not.exist");

    // Then wait for user button to appear (increased timeout for image loading)
    cy.get('[data-testid="user-button"]', { timeout: 15000 }).should(
      "be.visible"
    );

    // Reset uploaded image keys for each test
    uploadedImageKeys = [];
  });

  afterEach(() => {
    // Clean up uploaded images from uploadthing FIRST (even if test failed)
    // This handles cases where image was uploaded but product wasn't saved
    if (uploadedImageKeys.length > 0) {
      uploadedImageKeys.forEach((key) => {
        cy.task("uploadthing:deleteImage", key);
      });
    }

    // Clean up: delete images from uploadthing, then delete product
    if (testProductId) {
      cy.task("uploadthing:deleteProductImages", testProductId);
      cy.task("db:deleteTestProduct", testProductId);
    }
    // Clean up any remaining test products and their images (even if test failed)
    cy.task("db:deleteTestProductsByName", "Test Product");
    cy.task("db:cleanup");
  });

  it("should create a new product", () => {
    // Intercept uploadthing to capture image key BEFORE product is saved
    cy.intercept("POST", "**/api/uploadthing/**", (req) => {
      req.continue((res) => {
        if (res.body) {
          try {
            const body =
              typeof res.body === "string" ? JSON.parse(res.body) : res.body;
            if (Array.isArray(body) && body.length > 0 && body[0].key) {
              uploadedImageKeys.push(body[0].key);
            } else if (body.key) {
              uploadedImageKeys.push(body.key);
            }
          } catch {
            // Ignore parse errors
          }
        }
      });
    }).as("uploadthingRequest");

    // Also intercept the response to capture key from response
    cy.intercept("POST", "**/api/uploadthing/poll/**", (req) => {
      req.continue((res) => {
        if (res.body) {
          try {
            const body =
              typeof res.body === "string" ? JSON.parse(res.body) : res.body;
            if (Array.isArray(body) && body.length > 0 && body[0].key) {
              if (!uploadedImageKeys.includes(body[0].key)) {
                uploadedImageKeys.push(body[0].key);
              }
            } else if (body.key && !uploadedImageKeys.includes(body.key)) {
              uploadedImageKeys.push(body.key);
            }
          } catch {
            // Ignore parse errors
          }
        }
      });
    }).as("uploadthingPoll");

    // Navigate to admin products page
    cy.visit("/admin/products");
    cy.url().should("include", "/admin/products");

    // Click create product button
    cy.get('[data-testid="create-product-button"]').click();
    cy.url().should("include", "/admin/products/create");

    // Fill in the form
    const productName = `Test Product ${Date.now()}`;
    const productSlug = `test-product-${Date.now()}`;

    cy.get('input[name="name"]').clear().type(productName);
    cy.get('input[name="slug"]').clear().type(productSlug);
    cy.get('input[name="category"]').clear().type("Test Category");
    cy.get('input[name="brand"]').clear().type("Test Brand");
    cy.get('input[name="price"]').clear().type("29.99");
    cy.get('input[name="stock"]').clear().type("10");
    cy.get('textarea[name="description"]')
      .clear()
      .type("This is a test product description");

    // Upload image using Cypress native selectFile
    cy.get('input[type="file"]').selectFile(
      "cypress/fixtures/testCypressProductImg.jpg",
      { force: true }
    );

    // Wait for upload to complete and image to appear
    // Extract key from image URL - this is the most reliable method
    // We don't wait for intercept as it may not always fire with selectFile
    cy.get('img[alt="product image"]', { timeout: 15000 })
      .should("be.visible")
      .invoke("attr", "src")
      .then((src) => {
        if (src) {
          // Extract key from uploadthing URL (format: https://utfs.io/f/{key} or similar)
          // Try multiple URL formats
          let key: string | undefined;

          // Format 1: https://utfs.io/f/{key}
          if (src.includes("utfs.io")) {
            const urlParts = src.split("/");
            key = urlParts[urlParts.length - 1]?.split("?")[0];
          }

          // Format 2: Direct key in URL
          if (!key && src.includes("/f/")) {
            const match = src.match(/\/f\/([^/?]+)/);
            key = match ? match[1] : undefined;
          }

          // Fallback: last part of URL
          if (!key) {
            key = src.split("/").pop()?.split("?")[0];
          }

          if (key && key.length > 10 && !uploadedImageKeys.includes(key)) {
            uploadedImageKeys.push(key);
            cy.log(`Captured image key from URL: ${key}`);
          }
        }
      });

    // Submit the form - exclude hidden search button in header
    cy.get('button[type="submit"]:not(.sr-only)').click({ force: true });

    // Wait for redirect to products page
    cy.url({ timeout: 1000 }).should("include", "/admin/products");

    // Verify product was created by checking if it appears in the list
    cy.contains(productName).should("be.visible");

    // Get the product ID from the edit link and store it for cleanup
    cy.contains("tr", productName)
      .find('a[href*="/admin/products/"]')
      .first()
      .invoke("attr", "href")
      .then((href) => {
        if (href) {
          const match = href.match(/\/admin\/products\/([a-zA-Z0-9-]+)/);
          if (match && match[1]) {
            testProductId = match[1];
          }
        }
      });
  });

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

      // Submit the form - exclude hidden search button in header
      cy.get('button[type="submit"]:not(.sr-only)').click({ force: true });

      // Wait for redirect to products page
      cy.url({ timeout: 10000 }).should("include", "/admin/products");

      // Verify product was updated
      cy.contains(updatedName).should("be.visible");
      cy.contains(product.name).should("not.exist");
    });
  });
});
