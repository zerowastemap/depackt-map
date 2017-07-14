import choo from 'choo'
import Layout from '../client/views/layout'
import NotFound from '../client/views/404'
import AboutView from '../client/views/about'
import ResourcesView from '../client/views/resources'

const app = choo()
const noop = () => {}

app.route('/', Layout(noop))
app.route('/:bounds', Layout(noop))
app.route('/about', Layout(AboutView))
app.route('/about/:hash', Layout(AboutView))
app.route('/about/:hash/*', Layout(NotFound))
app.route('/resources', Layout(ResourcesView))
app.route('/:bounds/*', Layout(NotFound))

export default { app }
