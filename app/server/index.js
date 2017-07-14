import assert from 'assert'
import bankai from 'bankai'
import http from 'http'
import merry from 'merry'
import path from 'path'
import revPath from 'rev-path'
import from from 'from2'
import nodemailer from 'nodemailer'
import fs from 'fs'

import renderHtml from './render-html'

const hash = Date.now()
const clientPath = path.join(__dirname, '../client/index.js')

const assets = bankai(clientPath, {
  js: {
    exclude: 'node_modules/unicode/category/So.js',
    fullPaths: false,
    transform: [
      ['envify'],
      ['sheetify/transform', {
        'use': [
          [
            'sheetify-postcss', {
              'plugins': [
                [
                  'postcss-cssnext', {
                    'browsers': [
                      '> 1%',
                      'last 2 versions'
                    ]
                  }
                ]
              ]
            }
          ]
        ]
      }],
      ['yo-yoify'],
      ['babelify', {
        presets: [
          ['env', {
            'targets': {
              'browsers': ['last 2 versions', 'safari >= 7']
            }
          }]
        ],
        plugins: [
          'add-module-exports',
          'transform-object-assign'
        ]
      }]
    ]
  },
  html: false,
  optimize: true
})

function sendMail (body, callback) {
  const { email, text } = body

  if (!email) return callback(new Error('Missing required parameter email'), null)

  const transporter = nodemailer.createTransport({
    host: process.env.APP_MAIL_HOST,
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: process.env.APP_MAIL,
      pass: process.env.APP_MAIL_PASS
    }
  })

  transporter.sendMail({
    from: `"${email}" <${email}>`,
    to: 'hello@depackt.be',
    subject: 'New submission on depackt',
    html: `
      <li>Email: ${email}</li>
      <p>${text}</p>
    `
  }, (err, info) => {
    if (err) return callback(err, null)
    callback(null, 'Message %s sent: %s', info.messageId, info.response)
  })
}

function initialize (callback) {
  const app = merry()

  app.router([
    [revPath('/bundle.js', hash), render('js')],
    [revPath('/bundle.css', hash), render('css')],
    ['/:partial', renderHtml(hash)],
    ['/manifest.json', (req, res, ctx, done) => {
      res.setHeader('Content-Type', 'application/json')
      const stream = fs.readFileSync(path.join(__dirname, '../manifest.json'))
      done(null, stream.toString())
    }],
    ['/sw.js', (req, res, ctx, done) => {
      res.setHeader('Content-Type', 'application/javascript')
      done(null, `
        self.addEventListener('install', function(event) {
          // Perform install steps
        });

        var CACHE_NAME = 'depackt-cache-v1';
        var urlsToCache = [
          '${revPath('/bundle.js', hash)}',
          '${revPath('/bundle.css', hash)}'
        ];

        self.addEventListener('install', function(event) {
          // Perform install steps
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
              })
          );
        });

        self.addEventListener('fetch', function(event) {
          event.respondWith(
            caches.match(event.request)
              .then(function(response) {
                // Cache hit - return response
                if (response) {
                  return response;
                }
                return fetch(event.request);
              }
            )
          );
        });
      `)
    }],
    ['/assets/:file', render('static')],
    ['/assets/icons/:file', render('static')],
    [ '/new', {
      post: (req, res, ctx, done) => {
        merry.parse.json(req, (err, body) => {
          if (err) return done(err)
          sendMail(body, (err, response) => {
            if (err) return done(err)
            done(null, { message: response })
          })
        })
      }
    }]
  ])

  function render (method) {
    assert(typeof assets[method] === 'function')
    return (req, res, ctx, done) => done(null, from(assets[method](req, res).pipe(res)))
  }

  callback(app)
}

export const start = (done) => {
  const host = process.env.APP_HOST || '127.0.0.1'
  const port = process.env.APP_PORT || 8084
  const environment = process.env.APP_ENV || 'development'
  initialize((app) => {
    const server = http.createServer(app.start())
    server.listen(port, (err) => {
      if (err) return done(err, null)
      return done(null, (`Server online and listening at ${host}:${port} in ${environment}`))
    })
  })
}
