const { formatApplicationCode } = require('../helpers/helper-functions')
const createMsg = require('../messaging/create-msg')
const gapiService = require('../services/gapi-service')
const { appInsights } = require('ffc-messaging')
const { getYarValue, setYarValue } = require('../helpers/session')
const { sendApplicationDetails } = require('../messaging/senders')
const { set, get } = require('../repositories/application-repository')

const viewTemplate = 'confirmation'
const currentPath = '/confirmation'
const startPath = '/cart'

module.exports = {
  method: 'GET',
  path: currentPath,
  handler: async (request, h) => {
    if (!getYarValue(request, 'farmerDetails')) {
      return h.redirect(startPath)
    }
    const confirmationId = formatApplicationCode(request)

    try {
      const applicationDetails = createMsg.getAllDetails(request, confirmationId)
      await set({
        reference: confirmationId,
        grant_type: 'SGS001',
        data: JSON.stringify(applicationDetails),
        created_by: 'admin',
        updated_by: 'admin',
        updated_at: new Date(),
        created_at: new Date()
      })
      await sendApplicationDetails(applicationDetails, confirmationId)
      setYarValue(request, 'app-key', null)
      return h.view(viewTemplate, {
        output: {
          titleText: 'Details submitted',
          html: `Your reference number<br><strong>${confirmationId}</strong>`,
          surveyLink: process.env.SURVEY_LINK,
          confirmationId: confirmationId
        }
      })
    } catch (err) {
      appInsights.logException(null, { error: err })
      await gapiService.sendEvent(request, gapiService.categories.CONFIRMATION, 'Error')
      return h.view('500')
    }
  }
}
