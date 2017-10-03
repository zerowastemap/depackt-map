import hyperstream from 'hyperstream'
import path from 'path'
import fs from 'fs'
import from from 'from2'
import pump from 'pump'
import revPath from 'rev-path'
import client from './render-client'
import { log, error } from 'winston'

const Minifier = require('minify-html-stream').Minifier

function createHyperStream (options) {
  return hyperstream(options)
}

export default (hash) => {
  return (req, res, ctx, done) => {
    if (res) res.setHeader('Content-Type', 'text/html; charset=utf-8')

    const state = {
      coords: [50.850340, 4.351710],
      lang: 'fr',
      zoom: 13,
      locations: []
    }

    const inner = client.app.toString(req.url, state)
    const source = fs.createReadStream(path.join(__dirname, '../client/index.html'))
    const transform = createHyperStream({
      'html': {
        'lang': 'fr' // here you can update default lang
      },
      'head title': {
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
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@1.0.12/webcomponents-lite.min.js"></script>
        `
      }
    })

    const transform2 = createHyperStream({
      '#app': {
        'unresolved': 'unresolved'
      }
    })

    const dest = res

    done(null, from(pump(source, transform, transform2, new Minifier(), dest, (err) => {
      if (err) return error(err)
      log('info', 'pipe finished')
    })))
  }
}
