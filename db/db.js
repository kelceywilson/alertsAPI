const { Alert } = require('../db/models.js')

/*CODE_REVIEW: Consider also adding catch to router that calls these methods
*/

/**
* Callback to an express route to get all alerts
* @return {Promise} - resolves to an array of objects representing all alerts
*/
const getAllAlerts = () => {
  return Alert.find({})
    .sort({createdAt: -1})
    .catch(err => console.log(err))
}

/**
* Callback to an express route to add a new alert
* @param {object} newAlertPost - represents new alert
* @return {Promise} -resolves to an array of objects representing all alerts
*/
const addNewAlert = (newAlertPost) => {
  const newAlert = new Alert(newAlertPost)
  return newAlert.save()
    .then(() => getAllAlerts())
    .catch(err => console.log(err))
}

/**
 * Callback to an express route to get alert by its id
 * @param  {string} alertId - unique id of alert
 * @return {Promise} - resolves to an object representing the alert
 */
const getOneAlert = (alertId) => {
  return Alert.findById(alertId)
    .catch(err => console.log(err))
}

/**
 * Callback to an express route to delete an alert of given id
 * @param  {string} alertId - unique id of alert
 * @return {Promise} -resolves to an array of objects representing all alerts
 */
const deleteOneAlert = (alertId) => {
  return Alert.findById(alertId, (err, alertToDelete) => {
    alertToDelete.remove()
  })
    .catch(err => console.log(err))
}

module.exports = {
  addNewAlert,
  deleteOneAlert,
  getAllAlerts,
  getOneAlert
}
