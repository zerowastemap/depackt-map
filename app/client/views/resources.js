const html = require('choo/html')
const sideBar = require('../elements/side-bar.js')
const Nav = require('../elements/nav')
const Header = require('../elements/header')
const TITLE = 'Resources'

module.exports = (state, emit) => {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  const nav = Nav()

  const hashes = [
    {
      text: 'Cartes',
      hash: 'maps'
    },
    {
      text: 'Blogs',
      hash: 'blogs'
    },
    {
      text: 'Services',
      hash: 'services'
    },
    {
      text: 'Apps',
      hash: 'apps'
    }
  ]
  return html`
    <main role="main" class="layout flex">
      ${Header(state, emit)}
      ${state.sideBarOpen ? sideBar(state, emit) : ''}
      <section id="page" class="layout column row-l flex">
        <div class="flex25">
          ${module.parent ? '' : nav.render({items: hashes, hash: state.params.hash})}
        </div>
        <article role="article" class="flex2 markdown-body">
          <header class="layout">
            <h1>${state.title}</h1>
          </header>
          <section id="content">
            <h3 id="maps">
              <a href="/resources#maps">Des cartes en veux tu en voilà</a>
            </h3>
            <li>
              CBAI - Atlas de la cohésion sociale à Bruxelles
              <a target="_blank" rel="noopener noreferrer" href="http://atlas.cbai.be/">atlas.cbai.be</a>
            </li>
            <li>
              Belgique mode d'emploi
              <a target="_blank" rel="noopener noreferrer" href="http://maps.dewey.be/">maps.dewey.be</a>
            </li>
            <li>
              Réseau des consommateurs responsables
              <a target="_blank" rel="noopener noreferrer" href="http://www.asblrcr.be/carto">asblrcr.be/carto</a>
            </li>
            <li>
              Mundraub.org (de) Carte communautaire des arbres fruitiers/plantes commestibles dans l'espace public et plus
              <a target="_blank" rel="noopener noreferrer" href="https://mundraub.org/map">mundraub.org/map</a>
            </li>
            <li>
              The world-wide map for dumpster diving (en)
              <a target="_blank" rel="noopener noreferrer" href="http://dumpstermap.org/">dumpstermap.org</a>
            </li>

            <h3 id="blogs">
              <a href="/resources#blogs">Blogs et sites #zerodechet</a>
            </h3>

            <li>
              Blog zéro déchet: <a target="_blank" rel="noopener noreferrer" href="https://zerocarabistouille.be/2017/01/14/les-magasins-objectif-zero-dechet-vrac/">zerocarabistouille.be</a>
            </li>
            <li>
              Blog zéro déchet: <a target="_blank" rel="noopener noreferrer" href="http://milenandco.com/">zerocarabistouille.be</a>

            </li>
            <li>
              Adresses bio à Bruxelles: <a target="_blank" rel="noopener noreferrer" href="https://www.bioguide.be">bioguide.be</a>
            </li>

            <h3 id="services">
              <a href="/resources#services">Services gratuits eco-responsables en Belgique</a>
            </h3>

            <li>
              Ressourcerie Namuroise - Collecte gratuite d'encombrants à domicile
              <a target="_blank" rel="noopener noreferrer" href="https://www.laressourcerie.be/">laressourcerie.be</a>
            </li>

            <h3 id="apps">
              <a href="/resources#apps">Applications similaires</a>
            </h3>

            <p>Depackt propose une carte qui se veut plus intuitive et pratique qu'une liste ou d'autres solutions existentes. Il n'y aura probablement pas d'application mobile mais une attention particulière sera portée à la version mobile de l'application web. (toujours en développement)</p>
            <li>Consovrac : <a target="_blank" rel="noopener noreferrer" href="http://www.consovrac.com/">www.consovrac.com</a></li>
            <li>Bepakt : <a target="_blank" rel="noopener noreferrer" href="http://bepakt.com/packaging-free-supermarkets/list-of-packaging-free-supermarkets">bepakt.com</a></li>
            <li>Zero Waste Home Bulk Finder : <a target="_blank" rel="noopener noreferrer" href="http://zerowastehome.com/app/">zerowastehome.com/app</a></li>
          </section>
        </article>
        <aside class="layout column flex25">
          <div class="box-container" style="height: 100%;">
            <div class="sticky">
              <div class="box pa3 ma3">
                <nav>
                  <ul class="layout column no-style">
                    <li>
                      <a href="/">Map</a>
                    </li>
                    <li>
                      <a href="/about">About</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

        </aside>
      </section>
    </main>
  `
}
