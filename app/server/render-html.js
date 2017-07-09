const hyperstream = require('hyperstream')
const path = require('path')
const fs = require('fs')
const from = require('from2')
const pump = require('pump')
const revPath = require('rev-path')
const client = require('../client')

function createHyperStream (options) {
  return hyperstream(options)
}

function renderHtml (hash) {
  return (req, res, ctx, done) => {
    if (res) res.setHeader('Content-Type', 'text/html; charset=utf-8')

    const state = {
      coords: [50.850340, 4.351710],
      zoom: 13,
      locations: []
    }

    const inner = client.app.toString(req.url, state)
    const source = fs.createReadStream(path.join(__dirname, '../client/index.html'))
    const transform = createHyperStream({
      'html': {
        'lang': 'fr' // here you can update default lang
      },
      'title': {
        _text: `Depackt - Carte du zéro déchet` // change default title
      },
      'head': {
        _appendHtml: `
          <link rel="stylesheet" href="${revPath('/bundle.css', hash)}">
        `
      },
      'body': {
        _prependHtml: inner,
        _appendHtml: `
          <script type="text/javascript" src="${revPath('/bundle.js', hash)}" crossorigin="anonymous"></script>
          <script>
            if('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(function(registration) {
                      console.log('Service Worker Registered');
                });
              navigator.serviceWorker.ready.then(function(registration) {
                console.log('Service Worker Ready');
              });
            }
          </script>
        `
      }
    })

    const transform2 = createHyperStream({
      '#app': {
        'unresolved': 'unresolved'
      }
    })

    const dest = res

    done(null, from(pump(source, transform, transform2, dest, (err) => {
      console.log('pipe finished', err)
    })))
  }
}

module.exports = renderHtml
