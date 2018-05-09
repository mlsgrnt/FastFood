const css = require('sheetify');
const choo = require('choo');

css('tachyons');
css('./custom.css');

const app = choo();
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')());
} else {
  app.use(require('choo-service-worker')());
}

app.use(state => {
  state.foods = [
    { name: 'korean', emoji: '🍜' },
    { name: 'spaghetti', emoji: '🍝' },
    { name: 'sushi', emoji: '🍣' },
    { name: 'dumpling', emoji: '🥟' },
    { name: 'chinese', emoji: '🥡' },
    { name: '"ice cream"', emoji: '🍦' },
    { name: 'candy', emoji: '🍬' },
    { name: 'cafe', emoji: '☕' },
    { name: 'steak', emoji: '🥩' },
    { name: 'burger', emoji: '🍔' },
    { name: 'pizza', emoji: '🍕' },
    { name: 'hot dog', emoji: '🌭' },
    { name: 'sandwich', emoji: '🥪' },
    { name: 'taco', emoji: '🌮' },
    { name: 'burrito', emoji: '🌯' },
    { name: 'bakery', emoji: '🥖' },
    { name: 'pancakes', emoji: '🥞' }
  ];
});
app.use(require('./stores/maps'));
app.use(require('./stores/location'));

app.route('/', require('./views/main'));
app.route('/*', require('./views/food'));

module.exports = app.mount('body');
