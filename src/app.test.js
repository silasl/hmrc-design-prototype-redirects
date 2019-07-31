const request = require('supertest')

const app = require('./app')

jest.mock('../constants', () => ({
  redirectRoot: 'http://foo.bar',
  pathOverrides: {
    oldPath: 'newPath'
  }
}))

describe('App', () => {

  describe('/', () => {
    test('It should return 301 redirect to the correct url', () =>
      request(app)
        .get('/')
        .expect(301)
        .expect('Location', 'http://foo.bar'))
  })

  describe('/hmrc-content-guide/hmrc-style-guide', () => {
    test('It should return 301 redirect to the correct url', () =>
      request(app)
        .get('/hmrc-content-guide/hmrc-style-guide')
        .expect(301)
        .expect('Location', 'http://foo.bar/hmrc-content-style-guide/'))
    
    test('It should be agnostic of trailing slash', () =>
      request(app)
        .get('/hmrc-content-guide/hmrc-style-guide/')
        .expect(301)
        .expect('Location', 'http://foo.bar/hmrc-content-style-guide/'))
  })

  describe('/design-library', () => {
    test('It should return 301 redirect to the correct url', () =>
      request(app)
        .get('/design-library')
        .expect(301)
        .expect('Location', 'http://foo.bar/hmrc-design-patterns/'))
  })

  describe('/design-library/:pattern', () => {
    test('It should return 301 redirect to the same pattern on the new path', () =>
      request(app)
        .get('/design-library/foo')
        .expect(301)
        .expect('Location', 'http://foo.bar/hmrc-design-patterns/foo'))
        
    test('It should return 301 redirect to the overriden pattern on the new path if an override is found', () =>
      request(app)
        .get('/design-library/oldPath')
        .expect(301)
        .expect('Location', 'http://foo.bar/hmrc-design-patterns/newPath'))
  })

  describe('Wildcard', () => {
    test('It should return 301 redirect to the homepage for unmatched URLs', () =>
      request(app)
        .get('/not-a-path')
        .expect(301)
        .expect('Location', 'http://foo.bar'))
  })

})
