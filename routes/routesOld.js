const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()
const Alert = require('../db/models.js').Alert
const { login, postNewAlert, register } = require('../db/db.js')

// GET home page - layout.pug
// router.get('/', (req, res) => {
//   res.render('postAlert', {csrfToken: req.csrfToken()})
// })
// router.get('/', (req, res, next) => {
//   Alert.find({}, null, {sort: {createdAt: -1}} function(err, alerts){
//     if(err) return next(err)
//     res.json(alerts)
//   })
// })
router.get('/', (req, res, next) => {
  Alert.find({})
    .sort({sort: {createdAt: -1}})
    .exec(function(err, alerts){
      if(err) return next(err)
      res.json(alerts)
  })
})
// GET registration modal - register.pug
// router.get('/postAlert', (req, res) => {
//   res.render('postAlert', {csrfToken: req.csrfToken(), member: req.session.member})
// })

router.get('/postAlert', (req, res) => {
  res.render('postAlert')
})

// POST new Alert
router.post('/postAlert', (req, res) => {
  postNewAlert(req.body)
    .then((alert) => {
      console.log(alert)
      res.json(alert)
    })
    .catch(console.log)
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

module.exports = router
