const xhr = require('xhr')
const extend = require('xtend')

function request (path = '/') {
  const scheme = 'https://'
  const domain = 'api.depackt.be'
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=1000'
    },
    json: true,
    url: `${scheme}${domain}${path}`
  }
  const options = extend(defaultOptions, { url: `${scheme}${domain}${path}` })
  return new Promise((resolve, reject) => {
    return xhr(options, (err, res, body) => {
      if (err) { return reject(err) }
      resolve(body)
    })
  })
}

module.exports = {
  getLocations: (params) => {
    const {lat, lng, distanceKm} = params
    return request(`/locations?latitude=${lat}&longitude=${lng}&distanceKm=${distanceKm}`)
  }
}
