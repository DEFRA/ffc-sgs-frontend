
const currentPath = 'grants'
const nextPath = '/nature-of-business'

module.exports = {
  method: 'GET',
  path: currentPath,
  handler: (request, h) => {
    return h.view('grants', { button: { nextLink: nextPath, text: 'Nature of Business' } })
  }
}
