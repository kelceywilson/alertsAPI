require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alerts')

const router = require('./routes/router.js')
const auth = require('./routes/auth.js')

const morgan = require('morgan')

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(bodyParser.json({type: '*/*'}))

const db = mongoose.connection

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

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
