const express = require('express')
const bodyParser = require('body-parser')
const app = express()

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static('dist'))

// mongo
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/authTest')
const User = require('./user')

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
async function create(req, res) {
  req.body.token = User.generateToken()
  const user = await User.create(req.body)
  res.json(user)
}

async function index(req, res) {
  console.log(req.user)
  const users = await User.find()
  res.json(users)
}

async function show(req, res) {
  const user = await User.findOne({_id: req.params.id})
  if (user === null) return res.status(404).json({message: 'not found'})
  res.json(user)
}

app.use(
  '/api',
  express.Router()
    .post('/users', create)
)

app.use(
  '/api',
  partialAuth,
  express.Router()
    .get('/users', index)
)

app.use(
  '/api',
  authenticate,
  express.Router()
    .get('/users/:id', users.show)
)

app.listen(5000, () => {
  console.log('Access to http://localhost:5000')
})