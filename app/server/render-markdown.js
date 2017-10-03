import path from 'path'
import fs from 'fs'
import markdownIt from 'markdown-it'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'

export default () => {
  return (req, res, ctx, done) => {
    if (res) res.setHeader('Content-Type', 'text/html; charset=utf-8')

    const {name, lang} = ctx.params
    const stream = fs.createReadStream(path.join(__dirname, `../../assets/pages/${lang}/${name}.md`))
    const chunks = []

    stream.on('data', (chunk) => {
      chunks.push(chunk)
    })

    stream.on('error', (err) => {
      if (err) {
        res.statusCode = 404 // assume 404
        return done()
      }
    })

    stream.on('end', () => {
      const md = Buffer.concat(chunks).toString('utf8')
      done(null, markdownIt({
        html: true,
        linkify: true,
        typography: true
      }).use(markdownItTocAndAnchor)
        .render(md)
      )
    })
  }
}
