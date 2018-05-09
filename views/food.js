const html = require('choo/html');

module.exports = view;

function view(state, emit) {
  function reject() {
    state.currentPlaceIndex++;
    emit(state.events.RENDER);
    emit('maps:getDetail', state.currentPlaceIndex + 2); // always be a few ahead!
  }
  function accept(place) {
    state.chosenPlace = place;
    // temp:
    window.location = `https://citymapper.com/directions?startcoord=${
      state.position.latitude
    }%2C${state.position.longitude}&endcoord=${place.geometry.location.lat}%2C${
      place.geometry.location.lng
    }&endname=${place.name}&endaddress=${place.vicinity}`;
    console.log('celebrate!');
  }

  const Place = function (place) {
    // TODO: handle 0 items found
    if (place === undefined) {
      return state.currentPlaceIndex === undefined
        ? 'loading'
        : 'You didnt like anything. maybe try again?';
    }
    const foodItem = html`
    <div id="${
  place.id
}"class="bg-near-white dark-gray shadow-2 br2 pa3 h-auto min-vh-75 ma1 tl">
      <img class="w-100 pv2 h-max-5" src="${place.photo}" />
      <div>
        <h3 class="mb0 pb0 helvetica">${place.name}</h3>
        <h4 class="mv0 pv0 gray">${place.rating} stars</h4>
        ${
  place.travelTime
    ? html`<h4>${place.travelTime} minutes away</h4>`
    : ''
}
      </div>
      <div>
        <button onclick=${reject}>reject</button>
        <button onclick=${() => accept(place)}>accept</button>
      </div>
    </div>`;
    foodItem.addEventListener('touchstart', handleTouchStart);
    foodItem.addEventListener('touchmove', handleTouchMove);
    foodItem.addEventListener('touchend', handleTouchEnd);

    let prevX = null;
    let prevY = null;
    let readyToFade = false;
    let currentTouch = null;

    const rightSwipeThreshold = window.innerWidth - (window.innerWidth / 4);

    function handleTouchStart(e) {
      [prevX, prevY] = [
        e.changedTouches[0].screenX,
        e.changedTouches[0].screenY,
      ];
    }
    function handleTouchMove(e) {
      currentTouch = e.changedTouches[0].identifier;
      const [x, y] = [e.changedTouches[0].screenX, e.changedTouches[0].screenY];
      foodItem.style.transform = `translateX(${x - prevX}px)`;
      if (x < prevX && prevX > 150) {
        readyToFade = true;
      }

      foodItem.style.opacity = x < 150 && readyToFade ? x / 150 : 1;
    }
    function handleTouchEnd(e) {
      readyToFade = null;

      if (e.changedTouches[0].identifier !== currentTouch) {
        return; // just a tap!
      }
      const [x, y] = [e.changedTouches[0].screenX, e.changedTouches[0].screenY];
      if (x < window.innerWidth / 4) {
        reject();
      }
      if (x > rightSwipeThreshold && prevX < rightSwipeThreshold) {
        foodItem.style.transform = 'translateY(-100px)';
        accept(state.places[state.currentPlaceIndex]);
      }
      foodItem.style.opacity = 1;
      foodItem.style.transform = 'translateX(0)';
    }

    return foodItem;
  };
  document.ontouchmove = function (e) {
    e.preventDefault();
  };
  return html`
    <body class="bg-light-red helvetica tc">
    <h1>${
  state.foods.find(food => food.name === state.params.wildcard).emoji
}</h1>
    ${Place(state.places[state.currentPlaceIndex])}
    </body>
  `;
}
