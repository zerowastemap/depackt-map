const assert = require('assert')
const bankai = require('bankai')
const http = require('http')
const merry = require('merry')
const path = require('path')
const revPath = require('rev-path')
const hash = Date.now()
const from = require('from2')
const nodemailer = require('nodemailer')
const fs = require('fs')

const renderHtml = require('./render-html')

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
          ['latest']
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

  if (!email) return callback('Missing email field')

  const transporter = nodemailer.createTransport({
    host: 'mail.gandi.net',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: process.env.APP_MAIL,
      pass: process.env.APP_MAIL_PASS
    }
  })

  // setup email data with unicode symbols
  const mailOptions = {
    from: `"${email}" <${email}>`, // sender address
    to: 'hello@depackt.be',
    subject: 'New submission on depackt', // Subject line
    html: `
      <li>Email: ${email}</li>
      <p>${text}</p>
    `
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
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
            if (err) { return done(err) }
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

function start (done) {
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

module.exports = { start, sendMail }
