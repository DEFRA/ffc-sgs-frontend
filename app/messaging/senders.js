const { MessageSender } = require('ffc-messaging')
const msgCfg = require('../config/messaging')

const crmDetailsSender = new MessageSender(msgCfg.crmQueue)
const projectDetailsSender = new MessageSender(msgCfg.projectDetailsQueue)
const contactDetailsSender = new MessageSender(msgCfg.contactDetailsQueue)
const applicationDetailSender = new MessageSender(msgCfg.applicationSubmitTopic)

async function stop () {
  await crmDetailsSender.closeConnection()
  await projectDetailsSender.closeConnection()
  await contactDetailsSender.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

async function sendMsg (sender, msgData, msgType, correlationId) {
  try {
    const msg = {
      body: msgData,
      type: msgType,
      source: msgCfg.msgSrc,
      correlationId
    }
    await sender.sendMessage(msg)
    console.log('sending message', msg)
  } catch (e) {
    console.log('message', e)
  }
}

module.exports = {
  sendProjectDetails: async function (projectDetailsData, correlationId) {
    await sendMsg(projectDetailsSender, projectDetailsData, msgCfg.projectDetailsMsgType, correlationId)
  },
  sendContactDetails: async function (contactDetailsData, correlationId) {
    await sendMsg(contactDetailsSender, contactDetailsData, msgCfg.contactDetailsMsgType, correlationId)
  },
  sendApplicationDetails: async function (applicationDetailsData, correlationId) {
    await sendMsg(applicationDetailSender, applicationDetailsData, msgCfg.applicationSubmitMsgType, correlationId)
    await sendMsg(crmDetailsSender, applicationDetailsData, msgCfg.crmMsgType, correlationId)
  }
}
