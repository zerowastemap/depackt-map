const html = require('choo/html')
const Nav = require('../elements/nav')
const Card = require('../elements/card')
const TITLE = 'A propos'
const PageLayout = require('../elements/page-layout')

module.exports = (state, emit) => {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  const card = Card()
  const nav = Nav()

  const hashes = [
    {
      text: 'Qu\'est ce que depackt?',
      hash: 'depackt'
    },
    {
      text: 'Méthode',
      hash: 'methodology'
    },
    {
      text: 'Road map',
      hash: 'roadmap'
    },
    {
      text: 'Collaborer',
      hash: 'contributing'
    },
    {
      text: 'API',
      hash: 'api'
    },
    {
      text: 'Sources',
      hash: 'sources'
    },
    {
      text: 'Hébergeur',
      hash: 'hosting'
    },
    {
      text: 'Impressum',
      hash: 'impressum'
    },
    {
      text: 'Crédits',
      hash: 'credits'
    }
  ]
  return PageLayout((state, emit) => {
    return html`
      <section id="page" class="layout column flex row-l">
        <div class="flex25">
          ${module.parent ? '' : nav.render({items: hashes, hash: state.params.hash})}
        </div>
        <article role="article" class="flex2 markdown-body">
          <header class="layout">
            <h1>${state.title}</h1>
          </header>
          <blockquote>
            Note: La traduction du site n'est pas encore terminée. Le site sera entièrement traduit en Anglais, Allemand et Néerlandais de manière progressive. Les contenus non traduits en Allemand et Néerlandais seront proposés en Français ou en Anglais.
          </blockquote>
          <section id="content">
            <h3 id="depackt">
              <a href="/about#depackt">Qu'est ce que depackt?</a>
            </h3>

            <h4>Une carte</h4>

            <p>Depackt, c'est une carte des des épiceries et marchés bios à objectif zéro déchet en Belgique, au Luxembourg, en Allemagne et en France.</p>

            <h4>Un index (directory)</h4>

            <p>Depackt propose l'indexation gratuite de tout projet ou initiative dans le domaine du zéro déchet.</p>

            <p>Actuellement l'index comprends les marchés bios et épiceries à objectif zéro déchet mais également certains supermarchés et magasins en ligne. Le directory dispose d'une catégorie réservée aux coopératives.</p>

            <h3 id="methodology">
              <a href="/about#methodology">Méthode</a>
            </h3>
            <p>En déplacement, j'en profite pour parcourir les rues de Bruxelles, Berlin et à l'occasion, d'autres villes. Pour les autres, je m'en remet à vous et aux blogs sur le sujet. Sans cesse, de nouvelles initiatives dans le domaine du zero déchets apparaissent dans nos villes. Il faut leur donner la visibilité qu'elles méritent!</p>
            <p>Avant d'ajouter un lieu sur la carte, je vérifie que ce lieu propose bien du vrac de manière permanente ou occasionelle (marchés).</p>
            <p>Proposer du vrac en bio est donc la seule contrainte à ce jour. J'espère que cette carte donnera des idées à de nombreuses personnes pour soit ouvrir un nouveau magasin de vrac ou militer pour une prise de conscience des grandes enseignes.</p>

            <h3 id="roadmap">
              <a href="/about#roadmap">Road map</a>
            </h3>

            <ul>
              <li>Version stable 2.0.0</li>
              <li>Couvrir plus de pays</li>
              <li>Traduction de l'application en Anglais, Allemand et Néerlandais</li>
            </ul>

            <h3 id="contributing">
              <a href="/about#contributing">Collaborer</a>
            </h3>

            <p>Depackt est open source! Rendez-vous sur <a href="https://github.com/depackt/" target="_blank" rel="noopener noreferrer">github</a> pour en savoir plus!</p>

            <h3 id="api">
              <a href="/about#api">API</a>
            </h3>

            <p>L'API de depackt est ouverte à tous et utilisable gratuitement. Des changements sont susceptibles d'intervenir à tout moment, vous êtes donc prévenus. En cas d'abus, je me verrais dans l'obligation de limiter l'accès via un TOKEN unique pour chaque utilisateur. Dans tous les cas, merci de me contacter si vous désirez utiliser l'API depackt. : )</p>

              <a href="https://api.depackt.be/locations?latitude=50.85034&longitude=4.35171&distanceKm=50">https://api.depackt.be...</a>

            <h3 id="sources">
              <a href="/about#sources">Sources</a>
            </h3>
            <ul>
            <li>
              Blog zéro déchet: <a href="https://zerocarabistouille.be/2017/01/14/les-magasins-objectif-zero-dechet-vrac/">zerocarabistouille.be</a>
            </li>
            <li>
              Adresses bio à Bruxelles: <a href="https://www.bioguide.be">bioguide.be</a>
            </li>
            <li>
              Vous: <a href="/new">Ajouter un nouveau point à la carte</a>
            </li>
            </ul>
            <h3 id="hosting">
              <a href="/about#hosting">Hébergeur</a>
            </h3>
            <a target="_blank" rel="noopener noreferrer" href="https://gandi.net">Gandi.net</a>

            <h3 id="impressum">
              <a href="/about#impressum">Impressum</a>
            </h3>

            <ul>
            <li>
              <a href="/legal">Legal / Impressum</a>
            </li>
            <li>
              <a href="/privacy">Privacy / Datenschutzerklärung</a>
            </li>
            </ul>
            <h3 id="credits">
              <a href="/about#credits">Crédits</a>
            </h3>
            <ul>
              <li>Web Design & Development: <a href="mailto:hello@depackt.be">Augustin Godiscal</a></li>
              <li>Built using <a target="_blank" rel="noopener noreferrer" href="https://choo.io/">Choo</a></li>
              <li>Logo typeface: <a target="_blank" rel="noopener noreferrer" href="http://tightype.com/fabrik/">Fabrik</a>.</li>
              <li>Functional Icon design set by <a target="_blank" rel="noopener noreferrer" href="https://thenounproject.com/sophie-haskind">Sophie Haskind</a>.</li>
            </ul>
          </section>
        </article>
        <aside class="layout column flex25">
          <div class="box-container" style="height: 100%;">
            <div class="sticky">
              <div class="box pa3 ma3">
                <p>
                  Pour toute question, vous pouvez m'écrire à <a href="mailto:hello@depackt.be">hello@depackt.be</a>.
                </p>
              </div>
              <div class="box pa3 ma3">
                ${!module.parent ? card.render({
                  src: 'https://www.auggod.io/assets/auggod2.jpg',
                  href: 'https://www.auggod.io',
                  title: '@auggod',
                  name: 'Augustin Godiscal'
                }) : ''}
              </div>
            </div>
          </div>
        </aside>
      </section>
    `
  })(state, emit)
}
