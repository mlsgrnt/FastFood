module.exports = store;

function store(state, emitter) {
  state.position = undefined;

  emitter.on('DOMContentLoaded', () => {
    // emitter.on('geolocate', () => {
    navigator.geolocation.getCurrentPosition((position) => {
      state.position = position.coords;
      if (state.params.wildcard) { // load on pages where we already have a food type
        emitter.emit('maps:findNearby', state.params.wildcard);
      }
    });
    // });
  });
}
