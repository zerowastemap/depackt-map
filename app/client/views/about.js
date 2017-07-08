const html = require('choo/html')

module.exports = (state, emit) => {
  return html`
    <div class="layout">
      <aside class="flex25">
        <nav class="layout column sticky">
          <a href="/about#depackt">Qu'est ce que depackt?</a>
          <a href="/about#methodology">Méthode</a>
          <a href="/about#contact">Contact</a>
          <a href="/about#roadmap">Roadmap</a>
          <a href="/about#api">API</a>
          <a href="/about#sources">Sources</a>
          <a href="/about#hosting">Hébergeur</a>
          <a href="/about#impressum">Impressum</a>
          <a href="/about#social">Réseaux sociaux</a>
          <a href="/about#credits">Crédits</a>
        </nav>
      </aside>
      <section role="section" id="content" class="flex">
        <header role="header" class="layout">
          <h2>A-propos</h2>
        </header>
        <article role="article" class="markdown-body">
          <h3 id="depackt">
            <a href="/about#depackt">Qu'est ce que depackt?</a>
          </h3>
          <p>Cette carte a pour but de répertorier tous les lieux où il est possible d'acheter des aliments et produits bio en vrac.</p>
          <p>L'indexation sur la carte depackt est proposée gratuitement. Cependant, si vous le souhaitez, vous pouvez me soutenir en envoyant une somme d'argent par virement bancaire au compte DE24 1001 1001 2620 7805 93. Votre soutient me permettera d'alouer plus de temps au développement de depackt.</p>
          <p>Je suis à mon compte comme développeur freelance à Berlin. Mon objectif est de passer le plus de temps possible sur des projets chargés de sens dont les raisons ne sont pas guidées par le profit. Ce site n'est pas mon seul projet, si vous voulez en savoir plus n'hésitez pas à me contacter personellement.</p>
          <h3 id="methodology">
            <a href="/about#methodology">Méthode</a>
          </h3>
          <p>En déplacement, j'en profite pour parcourir les rues de Bruxelles, Berlin et à l'occasion, d'autres villes. Pour les autres, je m'en remet à vous et aux blogs sur le sujet. Sans cesse, de nouvelles initiatives dans le domaine du zero déchets apparaissent dans nos villes. Il faut leur donner la visibilité qu'elles méritent!</p>
          <p>Avant d'ajouter un lieu sur la carte, je vérifie que ce lieu propose bien du vrac de manière permanente ou occasionelle (marchés).</p>
          <p>Proposer du vrac en bio est donc la seule contrainte à ce jour. J'espère que cette carte donnera des idées à de nombreuses personnes pour soit ouvrir un nouveau magasin de vrac ou militer pour une prise de conscience des grandes enseignes.</p>
          <h3 id="contact">
            <a href="/about#contact">Contact</a>
          </h3>
          <p>
            Pour toute question, vous pouvez m'écrire à <a href="mailto:hello@depackt.be">hello@depackt.be</a>.
          </p>
          <h3 id="roadmap">
            <a href="/about#roadmap">Road map</a>
          </h3>
          <li>Afficher plus de détails pour chaque points (heures, reviews etc...)</li>
          <li>Traduction de l'application en Anglais, Allemand et Néerlandais</li>
          <li>Voir les points les plus proches par rapport à la localisation actuelle</li>
          <li>Ouverture d'un blog</li>
          <li>Ouverture de mon propre point de vente zéro déchet (rêve)</li>

          <h3 id="api">
            <a href="/about#api">API</a>
          </h3>

          <p>L'API de depackt est ouverte à tous et utilisable gratuitement. Des changements sont susceptibles d'intervenir à tout moment, vous êtes donc prévenus. En cas d'abus, je me verrais dans l'obligation de limiter l'accès via un TOKEN unique pour chaque utilisateur. Dans tous les cas, merci de me contacter si vous désirez utiliser l'API depackt. : )</p>
          <li>
            <a href="https://api.depackt.be/locations?latitude=50.85034&longitude=4.35171&distanceKm=50">https://api.depackt.be/locations?latitude=50.85034&longitude=4.35171&distanceKm=50</a>
          </li>

          <h3 id="sources">
            <a href="/about#sources">Sources</a>
          </h3>
          <li>
            Blog zéro déchet: <a href="https://zerocarabistouille.be/2017/01/14/les-magasins-objectif-zero-dechet-vrac/">zerocarabistouille.be</a>
          </li>
          <li>
            Adresses bio à Bruxelles: <a href="https://www.bioguide.be">bioguide.be</a>
          </li>
          <li>
            Vous: <a href="/new">Ajouter un nouveau point à la carte</a>
          </li>
          <h3 id="hosting">
            <a href="/about#hosting">Hébergeur</a>
          </h3>
          <a target="_blank" rel="noopener noreferrer" href="https://gandi.net">Gandi.net</a>

          <h3 id="impressum">
            <a href="/about#impressum">Impressum</a>
          </h3>

          <li>
            <a href="/legal">Legal / Impressum</a>
          </li>
          <li>
            <a href="/privacy">Privacy / Datenschutzerklärung</a>
          </li>
          <h3 id="social">
            <a href="/about#social">Réseaux sociaux</a>
          </h3>
          <li>
            <a href="https://facebook.com/depackt" rel="noopener noreferrer" target="_blank">Page facebook</a>
          </li>
          <li>
            <a href="https://twitter.com/depackt_" rel="noopener noreferrer" target="_blank">Page twitter (@depackt_)</a>
          </li>
          <h3 id="credits">
            <a href="/about#credits">Crédits</a>
          </h3>
          <li>Web Design & Development: <a href="mailto:hello@depackt.be">Augustin Godiscal</a></li>
          <li>Built using <a target="_blank" rel="noopener noreferrer" href="https://choo.io/">Choo</a></li>
          <li>Logo typeface: <a target="_blank" rel="noopener noreferrer" href="http://tightype.com/fabrik/">Fabrik</a>
          <li>Functional Icon design set by <a target="_blank" rel="noopener noreferrer" href="https://thenounproject.com/sophie-haskind">Sophie Haskind</a>.</li>
        </article>
      </section>
    </div>
  `
}
