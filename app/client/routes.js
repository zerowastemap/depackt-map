const Layout = require('./elements/layout') // main layout
const NotFound = require('./views/404')
const About = require('./views/about')
const Resources = require('./views/resources')
const MapView = require('./views/map')

module.exports = (app, components) => {
  app.route('/', MapView(components))
  app.route('/:bounds', MapView(components))
  app.route('/new', Layout(require('./views/new')))
  app.route('/auth/:flow', Layout(require('./views/auth')))
  app.route('/settings', Layout(require('./views/settings')(components)))
  app.route('/directory', Layout(require('./views/directory')(components)))
  app.route('/about', Layout(About))
  app.route('/about/:hash', Layout(About))
  app.route('/about/:hash/*', Layout(NotFound))
  app.route('/resources', Layout(Resources))
  app.route('/resources/:hash', Layout(Resources))
  app.route('/resources/:hash/*', Layout(NotFound))
  app.route('/privacy', Layout(require('./views/privacy')))
  app.route('/impressum', Layout(require('./views/impressum')))
  app.route('/:bounds/*', Layout(NotFound))
}
