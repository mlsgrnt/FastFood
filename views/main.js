const html = require('choo/html');

const TITLE = 'fastfood';

module.exports = view;

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE);

  // Enable scrolling.
  document.ontouchmove = function (e) {
    return true;
  };
  return html`
    <body class="bg-light-red light-gray helvetica tc center">
      <h1><span class="i">fast</span> food</h1>
      <ul class="f-headline list pl0 foodGrid pa1" >
        ${state.foods.map(food =>
    html`
          <li class="ma0 pa0 "><a  class=" black hover-bg-light-orange link bg-red" href="/${food.name}" id=${
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
