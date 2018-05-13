const express = require('express')
const bodyParser = require('body-parser')
const app = express()

process.on('uncaughtException', (err) => console.log('uncaughtException => ' + err))
process.on('unhandledRejection', (err) => console.log('unhandledRejection => ' + err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static('dist'))

// mongo
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/authTest')
const models = require('./models')

// auth
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer')
passport.use(new BearerStrategy(function(token, done) {
  models.User.findOne({token, deactivate: {$ne: true}}, function(err, user) {
    if (err) return done(err)
    if (!user) return done(null, false)
    return done(null, user)
  })
}))
const AnonymousStrategy = require('passport-anonymous')
passport.use(new AnonymousStrategy())
const authenticate = passport.authenticate('bearer', {session: false})
const partialAuth = passport.authenticate(['bearer', 'anonymous'], {session: false})

// api
const { users } = require('./routes')

app.use(
  '/api',
  express.Router()
    .post('/users', users.create)
)

app.use(
  '/api',
  partialAuth,
  express.Router()
    .get('/users', users.index)
)

app.use(
  '/api',
  authenticate,
  express.Router()
    .get('/users/:id', users.show)
    .put('/users/:id', users.update)
    .delete('/users/:id', users.remove)
)

app.listen(5000, () => {
  console.log('Access to http://localhost:5000')
})