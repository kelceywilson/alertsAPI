const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose

// var sortAnswers = function(a, b){
//   if(a.createdAt === b.createdAt){
//     return b.updatedAt - a.updatedAt
//   }
//   return b.createdAt - a.createdAt
// }

// Define our model
const AlertSchema = new Schema({
  alert_type: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  county: String,
  public: Boolean,
  title: String,
  body: String,
  price_value: Number,
  item_or_unit: String,
  measurement: String,
  discount: Number,
  category: String,
  quantity: Number,
  acreage: Number,
  frequency: Number,
  expires: Date,
  photo_url: String,
  event_date_time: Date,
  venue_name: String,
  rsvp_link: String,
  company: String,
  goal: String,
  url: String,
  deadline: Date,
  job_title: String,
  compensation: Number,
  need_have: String,
  item_for_trade: String,
  note: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
})

const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  display_name: String,
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: String,
  biographical: String,
  photo: String,
  accessToken: String,
  refreshToken: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  _alerts: [{type: Schema.Types.ObjectId, ref: 'Alert'}]
})

UserSchema.method('update', function(updates, callback){
  Object.assign(this, updates, {updatedAt: new Date()})
  this.parent().save(callback)
})

// this.password refers to the password of the user
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  console.log('UserSchema password', this.password);
  const isMatch = bcrypt.compareSync(candidatePassword, this.password)
  callback(null, isMatch)
}
// UserSchema.method('comparePassword', (candidatePassword, callback) => {
//   console.log(this.password);
//   const isMatch = bcrypt.compareSync(candidatePassword, this.password)
//   callback(null, isMatch)
// })

UserSchema.pre('save', function(next){
  const user = this
  user.password = bcrypt.hashSync(user.password, 14)
  next()
})

// AlertSchema.pre("save", function(next){
//   this.answers.sort(sortAnswers)
//   next()
// })


// Create the model class
const Alert = mongoose.model('Alert', AlertSchema)
const User = mongoose.model('User', UserSchema)

module.exports.Alert = Alert
module.exports.User = User
