import * as view from './view';

//Gets the user's current position from navigator API and render Map.
const loadMap = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(view.renderMap);
  }
};

const init = function () {
  loadMap();
};
init();

//Refactor fetching local storage data and rendering markers.
