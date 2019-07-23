describe("Sapper template app", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("has the title in an <h1>", () => {
    cy.contains("h1", "Canadiana access platform administration");
  });

  it("navigates to /deposit", () => {
    cy.get("nav a")
      .contains("Deposit")
      .click();
    cy.url().should("include", "/deposit");
  });

  it("navigates to /collection", () => {
    cy.get("nav a")
      .contains("Collections")
      .click();
    cy.url().should("include", "/collection");
  });
});
