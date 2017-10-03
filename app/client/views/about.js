const TITLE = 'A propos'
const page = 'about'

const html = require('choo/html')
const fs = require('fs')
const path = require('path')
const MarkdownIt = require('markdown-it')
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(markdownItTocAndAnchor)
const isServer = module.parent
const toHtml = require('../lib/to-html')

const ArticleElement = require('../elements/article')
const PageLayout = require('../elements/page-layout')

const nav = require('../elements/nav')()
const card = require('../elements/card')()
const translateArticle = require('../elements/translate-article.js')()

const sections = [
  'Qu\'est ce que depackt?',
  'Méthode',
  'Road map',
  'Collaborer',
  'API',
  'Sources',
  'Hébergeur',
  'Impressum',
  'Crédits'
]

module.exports = (state, emit) => {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return PageLayout(main)(state, emit)
}

function main (state, emit) {
  return html`
    <section id="page" class="flex mt4 pt4 flex-column flex-auto row-l">
      ${navigation()}
      ${article()}
      ${aside()}
    </section>
  `

  function navigation () {
    return html`
      <div class="flex25">
        ${!isServer ? nav.render({
          items: sections,
          hash: state.params.hash
        }) : ''}
      </div>
    `
  }

  function article () {
    // always render french by default
    // for now, can't translate on the server
    if (state.lang === 'fr' || isServer) {
      const el = ArticleElement({
        title: state.title,
        notice: fs.readFileSync(path.join(__dirname, '../../../assets/notice.txt'), 'utf8'),
        content: toHtml(md.render(fs.readFileSync(path.join(__dirname, '../../../assets/pages/fr/about.md'), 'utf8')))
      })
      return el
    }
    return translateArticle.render({
      lang: state.lang,
      title: state.title,
      name: page
    })
  }

  function aside () {
    return html`
      <aside class="flex flex-column flex25">
          <div class="box-container" style="height: 100%;">
            <div class="sticky">
              <div class="box pa3 ma3">
                <p>
                  Pour toute question, vous pouvez m'écrire à <a href="mailto:hello@depackt.be">hello@depackt.be</a>.
                </p>
              </div>
              <div class="box pa3 ma3">
                ${!isServer ? card.render({
                  src: 'https://www.auggod.io/assets/auggod2.jpg',
                  href: 'https://www.auggod.io',
                  title: '@auggod',
                  name: 'Augustin Godiscal'
                }) : ''}
              </div>
            </div>
          </div>
      </aside>
    `
  }
}
