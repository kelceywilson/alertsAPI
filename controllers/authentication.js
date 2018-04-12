const jwt = require('jwt-simple')
const User = require('../db/models').User
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  console.log(user.id);
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = (req, res, next) => {
  // user has already been authed, we just need to give token
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = (req, res, next) => {
  const { email, password } = req.body
  console.log(req.body);
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

    user.save((err) => {
      if(err) { return next(err) }
      res.json({ token: tokenForUser(user)})
    })
  })
}
