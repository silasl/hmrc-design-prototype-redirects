const express = require('express')

const { redirectRoute } = require('../constants')
const app = express()

app.get('/', (req, res) => {
  res.redirect(301, redirectRoute)
})

app.get('/:route', (req, res) => {
  res.send(`I am ${req.params.route}`)
})

module.exports = app