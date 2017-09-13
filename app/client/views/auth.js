const html = require('choo/html')
const serialize = require('form-serialize')

const PageLayout = require('../elements/page-layout')

module.exports = (state, emit) => {
  const { flow = 'signup' } = state.params
  const action = flow === 'signup' ? '/signup' : '/login'
  const TITLE = flow === 'signup' ? 'Sign up' : 'Log in'
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return PageLayout((state, emit) => {
    const template = flow === 'signup' ? signup : login
    return html`
      <section role="section" id="page" class="layout justify-center flex50 mt4">
        <form action=${action} method="POST" onsubmit=${handleSubmit}>
          ${template()}
        </form>
      </section>
    `

    function signup () {
      return html`
        <fieldset class="ma3 bg-white shadow-6">
          <legend class="fl pa3 ma0 w-100 tc b">Create a new account</legend>
          <div class="ma3">
            <label for="email" class="b f6">E-mail <small class="normal">We won't ever spam you!</small></label>
            <input type="email" name="email" id="email" placeholder="✉" required />
          </div>
          <div class="ma3">
            <label for="password" class="b f6">Password <small>We suggest using a strong password</small></label>
            <input type="password" name="password" id="password" placeholder="••••••••••••" required />
          </div>
          <div class="ma3">
            <button class="btn btn-default" type="submit">Sign up</button>
            <small class="ml3">Already a member? <a href="/auth/login">Login</a></small>
          </div>
        </fieldset>
      `
    }

    function login () {
      return html`
        <fieldset class="ma3 bg-white shadow-6">
          <legend class="fl pa3 ma0 w-100 tc b">Connect to your account</legend>
          <div class="ma3">
            <label for="email" class="b f6">E-mail</label>
            <input type="email" name="email" id="email" placeholder="✉" required />
          </div>
          <div class="ma3">
            <label for="password" class="b f6">Password</label>
            <input type="password" name="password" id="password" placeholder="•••••••••••" required />
          </div>
          <div class="ma3">
            <button class="btn btn-default" type="submit">Login</button>
            <small class="ml3">Not a member yet ? <a href="/auth/signup">Sign up</a></small>
          </div>
        </fieldset>
      `
    }

    function handleSubmit (e) {
      e.preventDefault()
      const data = serialize(e.target, { hash: true })

      console.log(data)
    }
  })(state, emit)
}
