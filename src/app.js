const express = require('express')

const { pathOverrides, redirectRoot } = require('../constants')

const app = express()
const debugMode = process.env.DEBUG === 'TRUE'
const redirect = (res, url) => debugMode ? res.send(url) : res.redirect(301, url)

// Redirect homepage to homepage
app.get('/', (req, res) => redirect(res, redirectRoot))

// Redirect style guide to style guide
app.get('/hmrc-content-guide/hmrc-style-guide', (req, res) =>
  redirect(res, `${redirectRoot}/hmrc-content-style-guide/`))

// Redirect design patterns root to design patterns root
app.get('/design-library', (req, res) =>
  redirect(res, `${redirectRoot}/hmrc-design-patterns/`))

// Redirect patterns using like for like path unless override specified
app.get('/design-library/:pattern', (req, res) => {
  const requestedPattern = req.params.pattern
  const overridePath = Object.keys(pathOverrides).find(oldPath => oldPath === requestedPattern)
  const newPath = pathOverrides[overridePath] || requestedPattern
  redirect(res, `${redirectRoot}/hmrc-design-patterns/${newPath}`)
})

// Catch any unknown URLs and forward to homepage
app.get('*', (req, res) => redirect(res, redirectRoot))

module.exports = app