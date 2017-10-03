import hyperstream from 'hyperstream'
import path from 'path'
import from from 'from2'
import trumpet from 'trumpet'
import pump from 'pump'
import markedStream from 'marked-stream'
import { waterfall } from 'async'
import fs from 'fs'

const MarkdownIt = require('markdown-it')
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default
const md = new MarkdownIt().use(markdownItTocAndAnchor)

export default () => {
  return (req, res, ctx, done) => {
    const {name} = ctx.params

    waterfall([
      page,
      images
    ], (err, result) => {
      if (err) {
        res.statusCode = 404 // assume 404
        return done()
      }
      done(null, {
        data: result
      })
    })

    function createHyperStream (options) {
      const hs = hyperstream(options)
      return hs
    }

    function page (callback) {
      const source = markedStream(path.join(__dirname, `../../assets/markdown/${name}.md`)) // create initial marked stream
      const tr = trumpet()
      const chunks = []

      // Replace all images with empty div
      tr.selectAll('img', (img) => {
        img.createWriteStream({outer: true}).end('<div class="image-was-here"></div>')
      })

      tr.on('data', (chunk) => {
        chunks.push(chunk)
      })

      from(pump(source, tr, (err) => {
        if (err) return callback(err)
        const page = Buffer.concat(chunks).toString('utf8')
        return callback(null, page)
      }))
    }

    function images (page, callback) {
      const source = markedStream(path.join(__dirname, `../../assets/markdown/${name}.md`)) // need to create a new stream
      const tr = trumpet()
      const chunks = []

      // Get all images and set sticky class
      tr.selectAll('img', (img) => {
        const images = img.createReadStream({outer: true})
        const hs = createHyperStream({
          'img': {
            class: { append: 'sticky' }
          }
        })
        pump(images, hs.on('data', (chunk) => {
          chunks.push(chunk)
        }), (err) => {
          console.log('pipe finished', err)
        })
      })

      from(pump(source, tr, (err) => {
        if (err) return callback(err)
        const images = Buffer.concat(chunks).toString('utf8')
        return callback(null, {
          // page,
          markdown: md.render(fs.readFileSync(path.join(__dirname, '../../assets/markdown/about-fr.md'), 'utf8')),
          images
        })
      }))
    }
  }
}
