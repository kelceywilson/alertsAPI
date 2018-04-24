const express = require('express')
const Authentication = require('../controllers/authentication')
const passportService = require('../services/passport')
const passport = require('passport')
const { Alert } = require('../db/models.js')
const { getAllAlerts } = require('../db/db.js')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

const router = express.Router()


router.get('/', requireAuth, (req, res) => {
  res.send({ message: 'superdooper'})
})
router.post('/signin', requireSignin, Authentication.signin)
router.post('/signup', Authentication.signup)

// GET all alerts page
// TODO change to get 10 at a time with additional parameter
router.get('/alerts', (req, res) => {
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
  console.log(req.query.terms);
  const terms = req.query.terms
  Alert
    .where({$or: [{title: { $in: [terms]}}]})
    .then((alerts) => {
      console.log(alerts)
      res.status(201).json(alerts)
    })
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
    alert.remove((error, deleted) => {
      if(error) return next(error)
      getAllAlerts()
        .then(alerts => res.status(201).json(alerts))
    })
  })
})

module.exports = router
