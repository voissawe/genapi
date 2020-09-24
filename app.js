const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
// set up the express app
const app = express()

require('dotenv').config()

// Log requests to console
app.use(logger('dev'))

// Parse incoming requests data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var allowedOrigins = ['http://localhost:3000']

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.'
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    },
  })
)

// Require Passport config
require('./server/config/passport')(passport)

// Require our routes into the application.
require('./server/routes/public')(app)
require('./server/routes/private')(app)

// Setup a default catch-all route that sends back a welcome
app.get('*', (req, res) =>
  res.status(200).send({
    message: 'API is ON',
  })
)

module.exports = app
