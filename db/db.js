
const pgp = require('pg-promise')()
const Alert = require('../db/models.js').Alert

const connection = 'postgres:///cromo'
// const connection = process.env.MONGODB_URI || 'postgres:///cromo'
// const connection = process.env.NODE_ENV === 'test'
//   ? 'postgres:///cromo_test'
//   : 'postgres:///cromo'

const db = pgp(connection)

const getAllAlerts = () => {
  return Alert.find({})
    .sort({createdAt: -1})
}

// search title or type in [terms]
// const searchAlerts = () => {
//   return Alert.find({})
// }

const register = (firstName, lastName, email, hash) => {
  const addUser = 'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING first_name'
  return db.one(addUser, [firstName, lastName, email, hash])
    .then((member) => {
      console.log('register', member)
      return member
    })
    .catch(err => Object({ success: false, message: err.message }))
}

const login = (email) => {
  const findUser = 'SELECT first_name, password FROM users WHERE email = $1'
  return db.oneOrNone(findUser, email)
    .then((member) => {
      console.log('login', member)
      return member
    })
    .catch(err => Object({ success: false, message: err.message }))
}


/**
 * Post new alert
 * @param  {object} newAlert - containing all new alert details
 * @return {Promise} - Promise resolving to new alert including id
 */
const postNewAlert = (newAlert) => {
  const query = `
    INSERT INTO alerts
      (alert_type_id, city, county, title, body, user_id)
    VALUES
      ($/alert_type_id/, $/city/, $/county/, $/title/, $/body/, $/user_id/)
    RETURNING *
  `
  return db.one(query, newAlert)
}

const vote = (id, direction, amount) =>
  db.oneOrNone('SELECT photo_id, upvotes, downvotes FROM votes WHERE photo_id = $1', id)
    .then((results) => {
      if (!results) {
        // insert new record with either 1 upvote or one downvote
        return db.one(`INSERT INTO votes(photo_id, ${direction}) VALUES($1, $2) RETURNING upvotes, downvotes`, [id, 1])
        .then((newresults1) => {
          console.log('1', newresults1)
          return newresults1
        })
      } else {
        let newCount = results[direction] + amount
        console.log(typeof amount, typeof results[direction])
        return db.oneOrNone(`UPDATE votes SET ${direction}=$1 WHERE photo_id=$2 RETURNING upvotes, downvotes`, [newCount, id])
        .then((newresults2) => {
          console.log('2', newresults2)
          return newresults2
        })
        .catch(err => Object({ success: false, message: err.message }))
      }
    })
    .catch(err => Object({ success: false, message: err.message }))

module.exports = {
  db,
  getAllAlerts,
  login,
  postNewAlert,
  register,
  vote
}
