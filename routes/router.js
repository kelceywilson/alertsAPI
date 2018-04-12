const express = require('express')
const bcrypt = require('bcryptjs')
const Authentication = require('../controllers/authentication')
const passportService = require('../services/passport')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

const router = express.Router()

const { Alert } = require('../db/models.js')
const {
  getAllAlerts,
  login,
  register
} = require('../db/db.js')

router.get('/', requireAuth, (req, res) => {
  res.send({ hi: 'there'})
})
router.post('/signin', requireSignin, Authentication.signin)
router.post('/signup', Authentication.signup)

// GET all alerts page
// change to get 10 at a time with additional parameter
router.get('/alerts', (req, res) => {
  console.log(req.sessionID);
  getAllAlerts()
    .then(alerts => res.json(alerts))
})

// POST new alert
router.post('/alerts', (req, res, next) => {
  const newAlert = new Alert(req.body)
  newAlert.save((err, alert) => {
    if(err) return next(err)
    return getAllAlerts()
      .then(alerts => res.status(201).json(alerts))
  })
})


// GET filter/search alerts
router.get('/alerts/search', (req, res, next) => {
  // destructure req.body
  console.log(req.query.terms);
  const terms = req.query.terms
  Alert
    .where({$or: [{title: { $in: [terms]}}]})
    .then((alerts) => {
      console.log(alerts)
      res.status(201).json(alerts)
    })
  // getAllAlerts()
})

// GET one alert
router.get('/alerts/:aID', (req, res, next) => {
  Alert.findById(req.params.aID, (err, doc) => {
    if(err) return next(err)
    res.json(doc)
  })
})

// DELETE one alert
router.delete('/alerts/:aID', (req, res, next) => {
  Alert.findById(req.params.aID, (err, alert) => {
    if(err) return next(err)
    console.log(alert);
    alert.remove((error, deleted) => {
      if(error) return next(error)
      getAllAlerts()
        .then(alerts => res.status(201).json(alerts))
    })
  })
})
// POST register new user
router.post('/register', (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 14)
  const firstName = req.body.first_name
  const lastName = req.body.last_name
  const email = req.body.email
  register(firstName, lastName, email, hash)
    .then((member) => {
      console.log('data', member)
      // res.clearCookie('error')
      req.session.member = member.first_name
      res.redirect('/postAlert')
    })
    .catch((error) => {
      console.log('error.code', error.code)
      if (error.code === '23505') {
        res.cookie('error', 'user with that email already exists')
      }
      res.redirect('/')
    })
})
router.post('/login', function (req, res) {
  login(req.body.email)
    .then((member) => {
      if (!member) {
        res.cookie('error', 'Invalid email/password combo')
      } else {
        console.log('routes', member)
        if (bcrypt.compareSync(req.body.password, member.password)) {
          console.log('user/password match! member:', member.first_name)
          req.session.member = member.first_name
          res.redirect('/postAlert')
        } else {
          res.render('login', { error: 'Invalid email/password combo' })
        }
      }
    })
    .catch((error) => {
      console.log('error', error)
      // if (error.code === '23505') {
      //   res.cookie('error', 'user with that email already exists')
      // }
      // res.redirect('/')
    })
})

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.reset()
  }
  res.redirect('/')
})

router.get('/profile', (req, res) => {
  if(req.user) {
    res.json({user: 'user authenticated'})
  } else {
    console.log('not logged in');
    res.redirect('/')
  }
})

module.exports = router
