const html = require('choo/html')
const isServer = module.parent

module.exports = toHtml

function toHtml (str) {
  if (isServer) return str
  const el = html`<div></div>`
  el.innerHTML = str
  return el
}
