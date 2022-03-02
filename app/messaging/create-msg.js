const Joi = require('joi')
const { getYarValue } = require('../helpers/session')
const emailConfig = require('../config/email')
const YAR_KEYS = ['liveStock', 'forestry', 'selectedEquipments', 'agreement', 'farmerDetails', 'businessDetails', 'grantTotal']
function getAllDetails (request, confirmationId) {
  const crn = request.auth.credentials.crn
  const callerId = request.auth.credentials.callerId
  const grantId = 'SGS001'
  return YAR_KEYS.reduce(
    (allDetails, key) => {
      allDetails[key] = getYarValue(request, key)
      return allDetails
    },
    { confirmationId, grantId, crn, callerId }
  )
}

const desirabilityAnswersSchema = Joi.object({
  productsProcessed: Joi.string(),
  howAddingValue: Joi.string(),
  projectImpact: Joi.array().items(Joi.string()),
  futureCustomers: Joi.array().items(Joi.string()),
  collaboration: Joi.string(),
  productsComingFrom: Joi.string(),
  processedSold: Joi.string(),
  environmentalImpact: Joi.array().items(Joi.string())
})

function getDesirabilityAnswers (request) {
  try {
    let envImpactVal = getYarValue(request, 'environmentalImpact')
    envImpactVal = Array.isArray(envImpactVal) ? envImpactVal : [envImpactVal]
    const val = {
      productsProcessed: getYarValue(request, 'productsProcessed'),
      howAddingValue: getYarValue(request, 'howAddingValue'),
      projectImpact: [getYarValue(request, 'projectImpact')].flat(),
      futureCustomers: getYarValue(request, 'futureCustomers'),
      collaboration: getYarValue(request, 'collaboration'),
      productsComingFrom: getYarValue(request, 'productsComingFrom'),
      processedSold: getYarValue(request, 'processedSold'),
      environmentalImpact: envImpactVal
    }
    const result = desirabilityAnswersSchema.validate(val, {
      abortEarly: false
    })
    if (result.error) {
      throw new Error(`The scoring data is invalid. ${result.error.message}`)
    }
    return result.value
  } catch (ex) {
    console.log(ex, 'error')
    return null
  }
}
function getEmailDetails (message, request) {
  const farmerContractorDetails = message.farmerDetails ?? message.contractorsDetails
  const email = farmerContractorDetails.emailAddress
  return {
    notifyTemplate: emailConfig.notifyTemplate,
    emailAddress: email,
    details: {
      firstName: farmerContractorDetails.firstName,
      lastName: farmerContractorDetails.lastName,
      referenceNumber: message.confirmationId,
      projectName: message.businessDetails.projectName,
      businessName: message.businessDetails.businessName,
      isFarmer: message.farmerDetails ? 'Yes' : 'No',
      isContractor: message.contractorsDetails ? 'Yes' : 'No',
      farmerName: farmerContractorDetails.firstName,
      farmerSurname: farmerContractorDetails.lastName,
      farmerEmail: farmerContractorDetails.emailAddress,
      contactConsent: message.consentOptional ? 'Yes' : 'No',
      scoreDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  }
}
module.exports = {
  getDesirabilityAnswers,
  getAllDetails,
  getEmailDetails
}
