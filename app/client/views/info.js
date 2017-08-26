const css = require('sheetify')
const html = require('choo/html')
const icon = require('../elements/icon')
const translate = require('../elements/translate')
const prefix = css`
  :host {
    padding: 1rem 2rem;
  }
  :host blockquote {
    font-size: 1rem;
  }
`

module.exports = (state, emit) => {
  return html`
    <div class=${prefix}>
      <article role="article" class="markdown-body">
        <blockquote>
          Depackt est une carte des initiatives zéro déchet (épiceries et marchés bio) en Belgique et ailleurs. <a href="/about">En savoir plus</a>
      </blockquote>
        <h2>Liens</h2>

        <li>
          <a href="/resources">${translate(state.translations, {term: 'RESOURCES'})}</a>
        </li>
        <li>
          <a href="/impressum">Impressum</a>
        </li>
        <li>
          <a href="/privacy">${translate(state.translations, {term: 'PRIVACY'})}</a>
        </li>

      <h2>Ailleurs</h2>

      <ul class="layout no-style social-icons">
        <li>
          <a class="btn btn-social" href="https://www.facebook.com/depackt" title="facebook" rel="noopener" target="_blank">
            ${icon('facebook', {'class': 'icon icon-large icon-social'})}
          </a>
        </li>
        <li>
          <a class="btn btn-social" href="https://twitter.com/depackt_" title="tweets" rel="noopener" target="_blank">
            ${icon('twitter', {'class': 'icon icon-large icon-social'})}
          </a>
        </li>
        <li>
          <a class="btn btn-social" href="https://github.com/depackt" title="contribute" rel="noopener" target="_blank">
            ${icon('github', {'class': 'icon icon-large icon-social'})}
          </a>
        </li>
        <li>
          <a class="btn btn-social" href="https://keybase.io/auggod" title="crypto" rel="noopener" target="_blank">
            ${icon('keybase', {'class': 'icon icon-large icon-social'})}
          </a>
        </li>
      </ul>
      </article>
    </div>
  `
}
