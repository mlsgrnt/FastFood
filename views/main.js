const html = require('choo/html');

const TITLE = 'fastfood - main';

module.exports = view;

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE);

  return html`
    <body class="bg-dark-red light-gray helvetica">
      <h1>fast food</h1>
      <ul class="f1" >
        ${state.foods.map(
          food =>
            html`<li><a href="/${food.name}" id=${
              food.name
            } onclick=${handleClick}>${food.emoji}</a></li>`
        )}
      </ul>
    </body>
  `;

  function handleClick(e) {
    emit('maps:findNearby', e.target.id);
  }
}
