const assert = require('assert')

module.exports = translate

function translate (translations, opts) {
  const { term } = opts

  assert.equal(typeof translations, 'object', 'elements/translate: where are translations ?')
  assert.equal(typeof opts, 'object', 'elements/translate: opts should be type object')

  return translations[term] || ''
}
