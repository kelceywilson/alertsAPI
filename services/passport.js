const passport = require('passport')
const User = require('../db/models').User
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// Create local strategy
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // verify email/pw - correct give done the user - otherwise give it false
  User.findOne({ email: email }, (err, user) => {
    if(err) { return done(err) }
    if(!user) { return done(null, false)}
    // compare pws
    console.log('pw from local signin', password);
    console.log('pw hash from db', user.password);
    user.comparePassword(password, (err2, isMatch) => {
      if(err2) { return done(err2) }
      if(!isMatch) { return done(null, false)}
      return done(null, user)
    })
  })
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// Create JWT strategy - payload is the token from tokenForUser
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
// See if the user id in the payload exists in our database
// If it does, call done with that user
// otherwise call done without user Object
  User.findById(payload.sub, function(err, user){
    if(err) { return done(err, false) }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)
