import hyperstream from 'hyperstream'
import path from 'path'
import from from 'from2'
import trumpet from 'trumpet'
import pump from 'pump'
import markedStream from 'marked-stream'
import { waterfall } from 'async'

export default () => {
  return (req, res, ctx, done) => {
    const {name} = ctx.params

    waterfall([
      page,
      images
    ], (err, result) => {
      if (err || !result.page) {
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
      const source = markedStream(path.join(__dirname, `../../assets/${name}.md`)) // create initial marked stream
      const tr = trumpet()
      const chunks = []

      source.on('error', (e) => {
        callback(e)
      })

      // Replace all images with empty div
      tr.selectAll('img', (img) => {
        img.createWriteStream({outer: true}).end('<div class="image-was-here"></div>')
      })

      tr.on('data', (chunk) => {
        chunks.push(chunk)
      })

      // Send the buffer or you can put it into a var
      tr.on('end', () => {
        const page = Buffer.concat(chunks).toString('utf8')
        callback(null, page)
      })

      from(pump(source, tr, (err) => {
        console.log('pipe finished', err)
      }))
    }

    function images (page, callback) {
      const source = markedStream(path.join(__dirname, `../../assets/${name}.md`)) // need to create a new stream
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

      tr.on('end', () => {
        const images = Buffer.concat(chunks).toString('utf8')
        callback(null, {
          page,
          images
        })
      })

      source.on('error', (e) => {
        callback(e)
      })

      from(pump(source, tr, (err) => {
        console.log('pipe finished', err)
      }))
    }
  }
}
