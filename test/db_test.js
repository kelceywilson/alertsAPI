const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const { expect } = chai

const db = require('../db/db.js')

describe('Sanity test', () => {
  it('true should be true', () => {
    expect(true).to.be.true
  })
})

describe('Mocha', () => {
  it('should run our tests using npm', () => {
    expect(true).to.be.ok
  })
})
