
const Alert = require('../db/models.js').Alert

const getAllAlerts = () => {
  return Alert.find({})
    .sort({createdAt: -1})
}

module.exports = {
  getAllAlerts
}
