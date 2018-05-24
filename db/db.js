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

/**
 * Callback to an express route to search for all alerts that has search terms in title or type
 * @param  {string} terms - entered search terms
 * @return {Promise} - resolves to array of objects representing relevant alerts
 */
const searchAlerts = (terms) => {
  console.log(terms);
  if (terms === '') {
    return getAllAlerts()
  }
  const splitTerms = terms.split(' ')
  return Alert.where({$or:
    [
      {alert_type: { $in: splitTerms}},
      {city: { $in: splitTerms}},
      {county: { $in: splitTerms}},
      {title: { $in: splitTerms}},
      {zip: { $in: splitTerms}}
    ]
  })
}

const filterAlerts = (filterBy) => {
  console.log(filterBy);
  return Alert.where({alert_type: filterBy})
}

module.exports = {
  addNewAlert,
  deleteOneAlert,
  filterAlerts,
  getAllAlerts,
  getOneAlert,
  searchAlerts
}
