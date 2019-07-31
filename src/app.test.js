const request = require('supertest')

const { redirectRoute } = require('../constants')
const app = require('./app')

describe('App', () => {

  describe('/', () => {
    test('It should return 301 redirect to the correct url', () =>
      request(app)
        .get('/')
        .expect(301)
        .expect(({ headers }) => headers.location === redirectRoute))
  })
})
