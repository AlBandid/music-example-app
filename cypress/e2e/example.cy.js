// https://on.cypress.io/api

describe('Sanity Test', () => {
  it('visits the app root url', () => {
    cy.visit('/') //visit the home page
    cy.contains('#header a:first-child', 'Music')
  })
})
