const express = require('express')

const { redirectRoot, redirectType } = require('../constants')
const { strict, patterns, wildcards } = require('../redirects.json')

const app = express()
const debugMode = process.env.DEBUG === 'TRUE'
const redirect = (res, url) => debugMode ? res.send(`${redirectType}: ${url}`) : res.redirect(redirectType, url)

// Handle strict URL > URL redirects first
Object.keys(strict).forEach(oldUrl =>
  app.get(oldUrl, (req, res) => redirect(res, `${redirectRoot}${strict[oldUrl]}`)))

// Then handle patterns
Object.keys(patterns).forEach(urlWithPattern => {
  const pattern = urlWithPattern.split(':')[1]
  app.get(urlWithPattern, (req, res) => {
    const requestedPattern = req.params[pattern]
    redirect(res, `${redirectRoot}${patterns[urlWithPattern]}${requestedPattern}/`)
  })
})

// Finally handle wildcards
Object.keys(wildcards).forEach(wildcard =>
  app.get(wildcard, (req, res) => redirect(res, `${redirectRoot}${wildcards[wildcard]}`)))

module.exports = app