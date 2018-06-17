const jwt = require('jwt-simple')
const { User } = require('../db/models')
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  console.log(user.id);
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = (req, res) => {
  // user has already been authed, we just need to give token
  console.log('authentication.signin', req.user);
  res.send({ token: tokenForUser(req.user), userId: req.user._id })
}

exports.signup = (req, res, next) => {
  const { email, password } = req.body
  if(!email || !password) {
    return res.status(422).send({error: 'provide email & password'})
  }
  // see if user exists
  User.findOne({email}, (err, existingUser) => {
    if(err) { return next(err) }

    // if user does exist, return error
    if(existingUser){
      return res.status(422).send({error: 'email in use'})
    }
    // if user does not exist, sign up
    const user = new User({
      email,
      password
    })

    user.save((err2) => {
      if(err) { return next(err2) }
      res.json({ token: tokenForUser(user), userId: req.user._id })
    })
  })
}
