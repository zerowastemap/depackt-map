const xhr = require('xhr')
const extend = require('xtend')

function request (path = '/') {
  const scheme = 'https://'
  const domain = process.env.API_DOMAIN
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
  search: ({query: q, selection}) => {
    if (!selection.length) return request(`/locations/search?q=${q}`)
    return request(`/locations/search?q=${q}&selection=${selection.join(' ')}`)
  },
  getLocations: ({lat, lng, distanceKm}) => {
    return request(`/locations?latitude=${lat}&longitude=${lng}&distanceKm=${distanceKm}`)
  },
  request
}
