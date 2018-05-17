const express = require('express')
const Authentication = require('../controllers/authentication')
const passportService = require('../services/passport')
const passport = require('passport')
const db = require('../db/db')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

const router = express.Router()

// TODO send any errors to the DOM as json

router.get('/', requireAuth, function(req, res){
  res.send({message: 'superdooper'})
})

// POST signin and signup using Passport authentication
router.post('/signin', requireSignin, Authentication.signin)
router.post('/signup', Authentication.signup)

// GET all alerts page
// TODO change to get 10 at a time with paging
router.get('/alerts', (req, res) => {
  db.getAllAlerts()
    .then(alerts => res.json(alerts))
    .catch(err => console.log(err))
})

// POST new alert
router.post('/alerts', (req, res) => {
  db.addNewAlert(req.body)
    .then(() => {
      db.getAllAlerts()
        .then(alerts => res.status(201).json(alerts))
    })
    .catch(err => console.log(err))
})

// GET filter/search alerts
router.get('/alerts/search', (req, res) => {
  const { terms } = req.query
  db.filterAlerts(terms)
    .then((alerts) => {
      res.json(alerts)
    })
    .catch(err => console.log(err))
})

// GET one alert
router.get('/alerts/:aID', (req, res) => {
  db.getOneAlert(req.params.aID)
    .then(alert => res.json(alert))
    .catch(err => console.log(err))
})

// DELETE one alert
router.delete('/alerts/:aID', (req, res) => {
  db.deleteOneAlert(req.params.aID)
    .then(() => {
      db.getAllAlerts()
        .then(alerts => res.json(alerts))
    })
    .catch(err => console.log(err))
})

module.exports = router
