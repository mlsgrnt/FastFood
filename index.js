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

app.use((state) => {
  state.foods = [
    { name: '"ice cream"', emoji: '🍦' },
    { name: 'bakery', emoji: '🥖' },
    { name: 'pancakes', emoji: '🥞' },
    { name: 'sweet', emoji: '🍬' },
    { name: 'sandwich', emoji: '🥪' },
    { name: 'cafe', emoji: '☕' },
    { name: 'sushi', emoji: '🍣' },
    { name: 'dumplings', emoji: '🥟' },
    { name: 'korean food', emoji: '🍜' },
    { name: 'chinese food', emoji: '🥡' },
    { name: 'steak', emoji: '🥩' },
    { name: 'burger', emoji: '🍔' },
    { name: 'pizza', emoji: '🍕' },
    { name: 'hot dog', emoji: '🌭' },
    { name: 'taco', emoji: '🌮' },
    { name: 'burrito', emoji: '🌯' },
    { name: 'doner', emoji: '🥙' },
  ];
});
app.use(require('./stores/maps'));
app.use(require('./stores/location'));
app.use(require('./stores/cards'));

app.route('/', require('./views/main'));
app.route('/*', require('./views/food'));

module.exports = app.mount('body');
