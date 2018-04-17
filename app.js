require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
// const sessions = require('client-sessions')
// const csrf = require('csurf')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/alerts')

// const passport = require('passport')
// const FacebookStrategy = require('passport-facebook').Strategy
// const { User } = require('./db/models')
// const generateOrFindUser = require('./generateOrFindUser')
//
// function generateOrFindUser (accessToken, refreshToken, profile, done){
//   // console.log(accessToken, refreshToken, profile);
//   if(profile.emails[0]){
//     User.findOneAndUpdate({
//       email: profile.emails[0].value
//     }, {
//       first_name: profile.displayName || profile.username,
//       email: profile.emails[0].value,
//       photo: profile.photos[0].value,
//       accessToken,
//       refreshToken
//     }, {
//       upsert: true
//     }, done)
//   } else {
//     const noEmailError = new Error('can not sign in')
//     done(noEmailError, null)
//   }
// }

// Facebook Strategy
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: 'https://localhost:443/auth/facebook/return',
//   profileFields: ['displayName', 'photos', 'email']
// }, generateOrFindUser))

// to serialize something is to translate a data structure for storage
// in this case, a session storage
// user can be something complex like a mongoose model
// done takes two values - an error and a translation to store i/t session
// passport.serializeUser((user, done) => {
//   console.log('serializeUser', user._id);
//   done(null, user._id)
// })

// to read the data again, you need to deserialize or reconstruct
// the stored data
// passport.deserializeUser((userId, done) => {
//   User.findById(userId, done)
// })

const router = require('./routes/router.js')
const auth = require('./routes/auth.js')

const morgan = require('morgan')

const app = express()
const fs = require('fs')


const https = require('https')

app.set('port', (process.env.PORT || 5000))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(bodyParser.json({type: '*/*'}))


const db = mongoose.connection

// Session config for Passport and MongoDB
// const sessionOptions = {
//   secret: 'chowder',
//   resave: false,
//   saveUninitialized: true,
//   store: new MongoStore({
//     mongooseConnection: db
//   })
// }

// app.use(session(sessionOptions))

// initialize passport
// app.use(passport.initialize())

// restore session
// app.use(passport.session())

// mongo error
db.on('error', (err) => {
  console.error('connection error:', err);
})

db.once('open', () => {
  console.log('db connection successful');
})

// this could all be replaced by installing cors middleware
// and then adding app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE')
    return res.status(200).json({})
  }
  next()
})

app.use('/static', express.static('public'))
// app.set('view engine', 'pug')

// app.use(sessions({
//   cookieName: 'session',
//   secret: 'some_random_string',
//   duration: 30 * 60 * 1000
// }))
// app.use(csrf()) // this needs to be above app.use(routes) - why?
// app.use((req, res, next) => {
//   if(!(req.session && req.session.user)){
//     return next()
//   }
//   User.findOne({ email: req.session.user.email}, function(err, user){
//     if(user){
//       req.user = user
//       delete req.user.password
//       req.session.user = user
//       res.locals.user = user
//     }
//     next()
//   })
// })

app.use('/auth', auth)
app.use('/', router)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  // If you pass an error to next() and you do not handle it in an error handler, it will be handled by the built-in error handler; the error will be written to the client with the stack trace.
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  console.log(err)
  res.status(err.status || 500)
  res.json({
    error: {
      message: `here ${err.message}`
    }
  })
})

// app.listen(app.get('port'), function () {
//   console.log('Node app is running on port', app.get('port'))
// })

const key = fs.readFileSync('./private.key')
const cert = fs.readFileSync('./primary.crt')
const ca = fs.readFileSync('./intermediate.crt')
const options = {
  key, cert, ca
}

https.createServer(options, app).listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
