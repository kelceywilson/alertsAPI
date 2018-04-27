const { Alert } = require('../db/models.js')

/**
* Callback to an express route to get all alerts
* @return {Promise} - resolves to an array of objects representing all alerts
*/
const getAllAlerts = () => Alert.find({}).sort({createdAt: -1})

/**
* Callback to an express route to add a new alert
* @param {object} newAlertPost - represents new alert
* @return {Promise} -resolves to an object representing the alert
*/
const addNewAlert = (newAlertPost) => {
  const newAlert = new Alert(newAlertPost)
  return newAlert.save()
}

/**
 * Callback to an express route to get alert by its id
 * @param  {string} alertId - unique id of alert
 * @return {Promise} - resolves to an object representing the alert
 */
const getOneAlert = alertId => Alert.findById(alertId)

/**
 * Callback to an express route to delete an alert of given id
 * @param  {string} alertId - unique id of alert
 * @return {Promise} - resolves to an array of objects representing all alerts
 */
const deleteOneAlert = alertId => Alert.findByIdAndRemove(alertId)

// TODO tweak to search body, price, etc., rather than type
/**
 * Callback to an express route to search for all alerts that has search terms in title or type
 * @param  {string} terms - entered search terms
 * @return {Promise} - resolves to array of objects representing relevant alerts
 */
const filterAlerts = (terms) => {
  const splitTerms = terms.split(' ')
  return Alert.where({$or: [{title: { $in: splitTerms}}, {type: { $in: splitTerms}}]})
}

module.exports = {
  addNewAlert,
  deleteOneAlert,
  filterAlerts,
  getAllAlerts,
  getOneAlert
}
