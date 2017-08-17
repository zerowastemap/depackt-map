const html = require('choo/html')
const loadHandler = (state, emit, element) => {
  element.value = state.form[element.name]
}
const sideBar = require('../elements/side-bar.js')
const Header = require('../elements/header')

module.exports = (state, emit) => {
  return html`
    <main role="main" class="layout flex">
      ${Header(state, emit)}
      ${state.sideBarOpen ? sideBar(state, emit) : ''}
      <section role="section" id="page" class="layout column flex ma4">
        <header role="header">
          <h2>Ajouter un point</h2>
        </header>
        <p class="info">
          ${state.sent ? 'Bien reçu!' : state.failed ? 'L\'envoi des données a échoué, merci de réessayer plus tard.' : 'Soumettez maintenant un nouveau point à ajouter sur la carte depackt! C\'est gratuit!'}
        </p>
        <form action="/new" method="POST" onsubmit=${(e) => {
          e.preventDefault()

          var data = {
            payload: {
              email: e.target.email.value,
              text: e.target.text.value
            }
          }

          emit('send:mail', data)
        }}>
          <div class="form-group">
            <input onload=${(el) => loadHandler(state, emit, el)} data-value=${state.form.email} value=${state.form.email} type="email" name="email" placeholder="Votre adresse e-mail" required />
          </div>
          <div class="form-group">
            <textarea onload=${(el) => loadHandler(state, emit, el)} rows="10" name="text" placeholder="Toutes les infos que vous avez à votre disposition (site internet, adresse, date d'ouverture etc...) sur une nouvelle épicerie ou marché bio proposant du vrac en Belgique ou ailleurs." required>${state.form.text}</textarea>
          </div>
          <div class="form-group">
            <button class="btn btn-default" disabled=${state.sent ? true : !!state.submitted} type="submit">Envoyer</button>
          </div>
        </form>
        <p class="info">Ce formulaire enverra automatiquement un email à hello@depackt.be avec les données reprises ci-dessus. Depackt.be vous garantis que votre addresse e-mail ne sera enregistrée dans aucune base de donnée interne ou externe à ce site.</p>
      </section>
    </main>
  `
}
