const xhr = require('xhr')

module.exports = translations

function translations () {
  return function (state, emitter) {
    const { lang = 'fr' } = state

    emitter.on('DOMContentLoaded', function () {
      console.log('Dom content loaded')
      getTranslations(lang)
    })

    emitter.on('load:translations', getTranslations) // ex: to change translations use emit('load:translations', 'de')

    function getTranslations (lang) {
      return xhr({
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=1000'
        },
        json: true,
        url: `/translations/${lang}`
      }, (err, res, body) => {
        if (err) return new Error('Xhr failed')
        state.translations = body
        emitter.emit('render')
      })
    }
  }
}
