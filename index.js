const css = require('sheetify');
const choo = require('choo');

css('tachyons');

const app = choo();
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')());
} else {
  app.use(require('choo-service-worker')());
}

app.use(require('./stores/maps'));
app.use(require('./stores/location'));

app.route('/', require('./views/main'));
app.route('/*', require('./views/404'));

module.exports = app.mount('body');
