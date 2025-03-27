describe('Audio Player', () => {
  it('plays audio', () => {
    cy.visit('/')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000) //we need to wait cause data is slow

    cy.get('.composition-name:first').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000) //we need to wait cause data is slow

    cy.get('#play-btn').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.get('#player-play-btn').click()
  })
})
