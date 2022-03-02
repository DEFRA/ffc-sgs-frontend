const { models } = require('../services/db-service')

async function get (ref) {
  const existingData =
        await models.applications.findOne(
          {
            attributes: ['id', 'data'],
            where: { reference: ref },
            order: [['id', 'DESC']]
          })
  if (existingData) {
    console.info(`Got application: ${existingData.id}`)
  }
  return existingData
}
async function set (data) {
  console.log(data, 'Set Repository')
  await models.applications.create(data)
}
module.exports = { get, set }
