const css = require('sheetify')
const html = require('choo/html')
const icon = require('../elements/icon.js')
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
          <a href="/resources">Resources</a>
        </li>
        <li>
          <a href="/legal">Legal</a>
        </li>
        <li>
          <a href="/privacy">Privacy</a>
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
