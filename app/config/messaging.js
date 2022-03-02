const Joi = require('joi')

const sharedConfigSchema = {
  appInsights: Joi.object(),
  host: Joi.string().default('localhost'),
  password: Joi.string(),
  username: Joi.string(),
  useCredentialChain: Joi.bool().default(false)
}

const messageConfigSchema = Joi.object({
  crmQueue: {
    address: Joi.string().default('projectDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  projectDetailsQueue: {
    address: Joi.string().default('projectDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  contactDetailsQueue: {
    address: Joi.string().default('contactDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  applicationSubmitTopic: {
    address: Joi.string().default('applicationDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  eligibilityAnswersMsgType: Joi.string(),
  projectDetailsMsgType: Joi.string(),
  contactDetailsMsgType: Joi.string(),
  applicationSubmitMsgType: Joi.string(),
  crmMsgType: Joi.string(),
  msgSrc: Joi.string()
})

const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const sharedCrmConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SGS_SERVICE_BUS_HOST,
  password: process.env.SGS_SERVICE_BUS_PASSWORD,
  username: process.env.SGS_SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants'

const config = {
  crmQueue: {
    address: 'sgs-application-topic',
    type: 'topic',
    ...sharedCrmConfig
  },
  projectDetailsQueue: {
    address: process.env.PROJECT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  contactDetailsQueue: {
    address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  applicationSubmitTopic: {
    address: process.env.APPLICATION_SUBMIT_TOPIC_ADDRESS,
    type: 'topic',
    ...sharedConfig
  },
  eligibilityAnswersMsgType: `${msgTypePrefix}.av.eligibility.details`,
  projectDetailsMsgType: `${msgTypePrefix}.av.project.details`,
  contactDetailsMsgType: `${msgTypePrefix}.av.contact.details`,
  applicationSubmitMsgType: `${msgTypePrefix}.application.details`,
  crmMsgType: `${msgTypePrefix}.application.details`,
  msgSrc: 'ffc-sgs-frontend'
}

// Validate config
const result = messageConfigSchema.validate(config, {
  abortEarly: false
})

// // Throw if config is invalid
if (result.error) {
  throw new Error(`The message config is invalid. ${result.error.message}`)
}

module.exports = result.value
