const Layout = require('./elements/layout') // main layout

module.exports = (app, components) => {
  app.route('/', require('./views/map')(components))
  app.route('/:bounds', require('./views/map')(components))
  app.route('/new', Layout(require('./views/new')))
  app.route('/auth/:flow', Layout(require('./views/auth')))
  app.route('/settings', Layout(require('./views/settings')(components)))
  app.route('/directory', Layout(require('./views/directory')(components)))
  app.route('/about', Layout(require('./views/about')))
  app.route('/about/:hash', Layout(require('./views/about')))
  app.route('/about/:hash/*', Layout(require('./views/404')))
  app.route('/resources', Layout(require('./views/resources')))
  app.route('/resources/:hash', Layout(require('./views/resources')))
  app.route('/resources/:hash/*', Layout(require('./views/404')))
  app.route('/privacy', Layout(require('./views/privacy')))
  app.route('/impressum', Layout(require('./views/impressum')))
  app.route('/:bounds/*', Layout(require('./views/404')))
}
