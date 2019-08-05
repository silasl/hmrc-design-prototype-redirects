const request = require('supertest')

const app = require('./app')

jest.mock('../constants', () => ({
  redirectRoot: 'http://foo.bar',
  redirectType: 301
}))

jest.mock('../redirects.json', () => ({
  "strict": {
    "/oldPath": "/newPath/",
    "/patternPath/overiddenPage": "/newPath/newPage"
  },
  "wildcards": {
    "*": "/"
  },
  "patterns": {
    "/patternPath/:pattern": "/newPath/"
  }
}))

describe('App', () => {

  describe('strict redirects', () => {
    test('It should return 301 redirect to the correct url', () =>
      request(app)
        .get('/oldPath')
        .expect(301)
        .expect('Location', 'http://foo.bar/newPath/'))
    
    test('It should be agnostic of trailing slash', () =>
      request(app)
        .get('/oldPath/')
        .expect(301)
        .expect('Location', 'http://foo.bar/newPath/'))
  })

  describe('pattern redirects', () => {
    test('It should return 301 redirect to the same pattern on the new path', () =>
      request(app)
        .get('/patternPath/page')
        .expect(301)
        .expect('Location', 'http://foo.bar/newPath/page/'))
        
    test('It should ignore the pattern matcher if a match is found in strict', () =>
      request(app)
        .get('/patternPath/overiddenPage')
        .expect(301)
        .expect('Location', 'http://foo.bar/newPath/newPage'))
  })

  describe('Wildcard', () => {
    test('It should return 301 redirect to the homepage for unmatched URLs', () =>
      request(app)
        .get('/not-a-path')
        .expect(301)
        .expect('Location', 'http://foo.bar/'))
  })

})
