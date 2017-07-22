const assert = require('assert')
const formatUnicorn = require('format-unicorn/safe')

module.exports = translate

function translate (translations, opts) {
  const { term = '', format } = opts

  assert.equal(typeof translations, 'object', 'elements/translate: where are translations ?')
  assert.equal(typeof opts, 'object', 'elements/translate: opts should be type object')

  const tr = translations[term]

  if (format) return formatUnicorn(tr, format)

  return tr
}
