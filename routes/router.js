const express = require('express')
const Authentication = require('../controllers/authentication')
const passportService = require('../services/passport')
const passport = require('passport')
const { Alert } = require('../db/models.js')
const {
  addNewAlert,
  deleteOneAlert,
  getAllAlerts,
  getOneAlert
} = require('../db/db.js')

/* CODE_REVIEW: Consider replacing methods above with :
const db = require('../db/db')
- will have to update db.js to do this.
*/

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
// GET one alert
router.get('/alerts/:aID', (req, res) => {
  getOneAlert(req.params.aID)
    .then(alert => res.json(alert))
})
// POST new alert
router.post('/alerts', (req, res) => {
  addNewAlert(req.body)
    .then(alerts => res.json(alerts))
})
// GET filter/search alerts
// TODO modularize into db.js file and make fuzzy
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

// DELETE one alert
router.delete('/alerts/:aID', (req, res, next) => {
  deleteOneAlert(req.params.aID)
    .then(deleted => console.log(deleted))
    .then(() => {
      getAllAlerts()
        .then(alerts => res.status(201).json(alerts))
    })
})

module.exports = router
