const html = require('choo/html');

const TITLE = 'fastfood';

module.exports = view;

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE);
  return html`
    <body class=" light-gray helvetica ">
      <span class="f1 b red"><span class="i">fast</span> food</span>
      <ul class="f-headline list pl0 foodGrid pa1 ma0" >
        ${state.foods.map(food =>
    html`
          <li class="ma0 pa0 "><a  class=" black link" href="/${food.name}" id=${
  food.name
} onclick=${handleClick}>${food.emoji}</a></li>
    `)}
      </ul>
    </body>
  `;

  function handleClick(e) {
    window.scrollTo(0, 0);
    emit('maps:findNearby', e.target.id);
  }
}
