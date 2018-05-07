module.exports = store;

function store(state, emitter) {
  state.position = undefined;

  emitter.on('DOMContentLoaded', () => {
    // emitter.on('geolocate', () => {
    navigator.geolocation.getCurrentPosition((position) => {
      state.position = position.coords;
    });
    // });
  });
}
