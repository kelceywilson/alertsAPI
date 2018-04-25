const passport = require('passport')
const { User } = require('../db/models')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// Create local strategy
const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if(err) { return done(err) }
    if(!user) { return done(null, false) }
    user.comparePassword(password, (err2, isMatch) => {
      if(err2) { return done(err2) }
      if(!isMatch) { return done(null, false) }
      return done(null, user)
    })
  })
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// JWT strategy - payload is the token from tokenForUser
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // See if the user id in the payload exists in our database
  // If it does, call done with that user
  // otherwise call done without user Object
  User.findById(payload.sub, function(err, user){
    if(err) { return done(err, false) }
    if (user) {
      return done(null, user)
    }
    return done(null, false)
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)
