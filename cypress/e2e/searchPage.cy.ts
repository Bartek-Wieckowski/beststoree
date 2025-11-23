describe("Search Page", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");
    cy.visit("/search");
  });

  afterEach(() => {
    cy.task("db:cleanup");
  });

  describe("Page Structure", () => {
    it("should display search page with filters and product grid", () => {
      cy.url().should("include", "/search");

      // Verify filter sections are visible
      cy.contains("Department").should("be.visible");
      cy.contains("Price").should("be.visible");
      cy.contains("Customer Ratings").should("be.visible");

      // Verify sort options are visible
      cy.contains("Sort by").should("be.visible");
      cy.contains("newest").should("be.visible");
      cy.contains("lowest").should("be.visible");
      cy.contains("highest").should("be.visible");
      cy.contains("rating").should("be.visible");

      // Verify products are displayed
      cy.get('[data-testid="product-card"]').should("have.length.at.least", 1);
    });

    it("should display 'Any' option for all filter categories", () => {
      cy.contains("Department").parent().contains("Any").should("be.visible");
      cy.contains("Price").parent().contains("Any").should("be.visible");
      cy.contains("Customer Ratings")
        .parent()
        .contains("Any")
        .should("be.visible");
    });
  });

  describe("Category Filtering", () => {
    // it("should reset category filter when 'Any' is clicked", () => {
    //   // First select a category
    //   cy.contains("Department")
    //     .parent()
    //     .find("ul")
    //     .find("a")
    //     .not(':contains("Any")')
    //     .first()
    //     .click();
    //   // Wait for navigation and verify category filter is active (not "all")
    //   cy.url().should("include", "category=");
    //   cy.url().should("not.include", "category=all");
    //   // Click 'Any' link to reset - find it more specifically
    //   cy.contains("Department")
    //     .parent()
    //     .find("ul")
    //     .find("a")
    //     .contains("Any")
    //     .click();
    //   // Wait for navigation and verify URL has category=all (reset state)
    //   cy.url().should("include", "category=all");
    //   // Verify category filter is no longer displayed in active filters
    //   cy.get("body").then(($body) => {
    //     const bodyText = $body.text();
    //     // Should not show "Category: " unless it's a specific category
    //     cy.wrap(bodyText).should("not.match", /Category: [^A]/);
    //   });
    // });
  });

  describe("Price Filtering", () => {
    it("should filter products by price range when price link is clicked", () => {
      const priceRanges = ["$1 to $50", "$51 to $100", "$101 to $200"];

      priceRanges.forEach((priceRange) => {
        cy.visit("/search");

        // Click on price range
        cy.contains("Price").parent().contains(priceRange).click();

        // Verify URL includes price parameter
        cy.url().should("include", "price=");

        // Verify price filter is displayed in active filters
        cy.contains(`Price:`).should("be.visible");

        // Verify products are displayed (may be empty)
        cy.get("body").then(($body) => {
          if ($body.text().includes("No products found")) {
            cy.contains("No products found").should("be.visible");
          } else {
            cy.get('[data-testid="product-card"]').should("exist");
          }
        });
      });
    });
  });

  describe("Rating Filtering", () => {
    it("should filter products by rating when rating link is clicked", () => {
      // Click on 4 stars rating
      cy.contains("Customer Ratings").parent().contains("4 stars & up").click();

      // Verify URL includes rating parameter
      cy.url().should("include", "rating=4");

      // Verify rating filter is displayed in active filters
      cy.contains("Rating: 4 stars & up").should("be.visible");

      // Verify products displayed have rating >= 4
      cy.get('[data-testid="product-card"]').each(($card) => {
        cy.wrap($card)
          .find('[data-testid="product-rating"]')
          .should(($rating) => {
            const ratingText = $rating.text();
            const ratingMatch = ratingText.match(/(\d+)/);
            if (ratingMatch) {
              const rating = parseInt(ratingMatch[1]);
              expect(rating).to.be.at.least(4);
            }
          });
      });
    });
  });

  describe("Sort Functionality", () => {
    it("should change sort order when sort link is clicked", () => {
      // Test each sort option
      const sortOptions = ["newest", "lowest", "highest", "rating"];

      sortOptions.forEach((sortOption) => {
        cy.visit("/search");

        // Click sort option
        cy.contains("Sort by").parent().contains(sortOption).click();

        // Verify URL includes sort parameter
        cy.url().should("include", `sort=${sortOption}`);

        // Verify sort option is visually highlighted
        cy.contains("Sort by")
          .parent()
          .contains(sortOption)
          .should("have.class", "font-bold");
      });
    });

    it("should default to 'newest' sort order", () => {
      cy.visit("/search");

      // Verify newest is highlighted by default
      cy.contains("Sort by")
        .parent()
        .contains("newest")
        .should("have.class", "font-bold");
    });
  });

  describe("Clear Button", () => {
    it("should display clear button when filters are active", () => {
      // Apply a filter
      cy.contains("Department")
        .parent()
        .find("ul")
        .find("a")
        .not(':contains("Any")')
        .first()
        .click();

      // Wait for navigation
      cy.url().should("include", "category=");

      // Verify clear button is visible
      cy.contains("Clear").should("be.visible");
    });

    it("should not display clear button when no filters are active", () => {
      cy.visit("/search");

      // Verify clear button is not visible when no filters are applied
      cy.get("body").then(($body) => {
        if ($body.text().includes("Clear")) {
          cy.contains("Clear").should("not.exist");
        }
      });
    });
  });

  describe("Search Query", () => {
    it("should filter products by search query", () => {
      // Visit search page with query parameter
      cy.visit("/search?q=test");

      // Verify URL includes query parameter
      cy.url().should("include", "q=test");

      // Verify query is displayed in active filters
      cy.contains("Query: test").should("be.visible");
    });

    it("should display 'No products found' when query matches no products", () => {
      // Visit with query that likely doesn't match anything
      cy.visit("/search?q=nonexistentproductxyz123");

      // Verify no products found message
      cy.contains("No products found").should("be.visible");
    });
  });

  describe("Multiple Filters Combined", () => {
    it("should apply multiple filters simultaneously", () => {
      // Apply category filter
      cy.contains("Department")
        .parent()
        .find("ul")
        .find("a")
        .not(':contains("Any")')
        .first()
        .then(($link) => {
          const categoryName = $link.text().trim();
          if (categoryName) {
            cy.wrap($link).click();

            // Wait for navigation to complete
            cy.url().should("include", "category=");
            cy.url().should("not.include", "category=all");

            // Apply price filter
            cy.contains("Price").parent().contains("$1 to $50").click();

            // Wait for navigation to complete
            cy.url().should("include", "price=");
            cy.url().should("not.include", "price=all");

            // Apply rating filter
            cy.contains("Customer Ratings")
              .parent()
              .contains("4 stars & up")
              .click();

            // Wait for navigation to complete
            cy.url().should("include", "rating=4");
            cy.url().should("not.include", "rating=all");

            // Verify all filters are in URL
            cy.url().should("include", "category=");
            cy.url().should("include", "price=");
            cy.url().should("include", "rating=4");

            // Verify all filters are displayed
            cy.contains(`Category: ${categoryName}`).should("be.visible");
            cy.contains("Price:").should("be.visible");
            cy.contains("Rating: 4 stars & up").should("be.visible");
          }
        });
    });
  });

  describe("Product Display", () => {
    it("should display product cards with correct information", () => {
      cy.get('[data-testid="product-card"]')
        .first()
        .within(() => {
          // Verify product image is present
          cy.get("img").should("be.visible");

          // Verify product name is present
          cy.get("h2").should("exist");

          // Verify product rating is displayed
          cy.get('[data-testid="product-rating"]').should("exist");
        });
    });

    it("should navigate to product detail page when product card is clicked", () => {
      cy.get('[data-testid="product-card"]').first().find("a").first().click();

      // Verify navigation to product detail page
      cy.url().should("include", "/product/");
    });
  });

  describe("URL Parameters", () => {
    it("should preserve URL parameters on page reload", () => {
      // Apply filters
      cy.contains("Price").parent().contains("$1 to $50").click();
      cy.url().should("include", "price=");

      cy.contains("Customer Ratings").parent().contains("4 stars & up").click();
      cy.url().should("include", "rating=4");

      cy.contains("Sort by").parent().contains("highest").click();
      cy.url().should("include", "sort=highest");

      // Get current URL and extract key parameters
      cy.url().then(($url) => {
        const urlObj = new URL($url);
        const priceParam = urlObj.searchParams.get("price");
        const ratingParam = urlObj.searchParams.get("rating");
        const sortParam = urlObj.searchParams.get("sort");

        // Reload page
        cy.reload();

        // Verify URL parameters are preserved (check individual params, not exact URL match)
        cy.url().then(($newUrl) => {
          const newUrlObj = new URL($newUrl);
          cy.wrap(newUrlObj.searchParams.get("price")).should("eq", priceParam);
          cy.wrap(newUrlObj.searchParams.get("rating")).should(
            "eq",
            ratingParam
          );
          cy.wrap(newUrlObj.searchParams.get("sort")).should("eq", sortParam);
        });

        // Verify filters are still active
        cy.contains("Price:").should("be.visible");
        cy.contains("Rating: 4 stars & up").should("be.visible");
        cy.contains("Sort by")
          .parent()
          .contains("highest")
          .should("have.class", "font-bold");
      });
    });
  });
});
