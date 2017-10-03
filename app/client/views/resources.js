const html = require('choo/html')
const Nav = require('../elements/nav')
const PageLayout = require('../elements/page-layout')
const TITLE = 'Resources'
const fs = require('fs')
const path = require('path')
const MarkdownIt = require('markdown-it')
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default
const md = new MarkdownIt().use(markdownItTocAndAnchor)
const Article = require('../elements/article')

const sections = [
  'Cartes',
  'Blogs',
  'Services',
  'Apps'
]

module.exports = (state, emit) => {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  const nav = Nav()

  return PageLayout((state, emit) => {
    const article = Article({
      title: state.title,
      notice: fs.readFileSync(path.join(__dirname, '../../../assets/notice.txt'), 'utf8'),
      content: toHtml(md.render(fs.readFileSync(path.join(__dirname, '../../../assets/markdown/resources-fr.md'), 'utf8')))
    })
    return html`
      <section id="page" class="flex mt4 pt4 flex-column flex-auto row-l">
        <div class="flex25">
          ${!module.parent ? nav.render({
            items: sections,
            hash: state.params.hash
          }) : ''}
        </div>
        ${article}
        <aside class="flex flex-column flex25">
          <div class="box-container" style="height: 100%;">
            <div class="sticky">
              <div class="box pa3 ma3">
                <nav>
                  <ul class="flex flex-column list ma0 pa0">
                    <li>
                      <a class="db pa3" href="/">Map</a>
                    </li>
                    <li>
                      <a class="db pa3" href="/about">About</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

        </aside>
      </section>
    `
    function toHtml (str) {
      if (module.parent) return str
      const el = html`<div></div>`
      el.innerHTML = str
      return el
    }
  })(state, emit)
}
