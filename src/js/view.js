import {
  MAX_ZOOM,
  POPUP_MAX_WIDTH,
  POPUP_MAX_HEIGHT,
  PAN_DURATION_SEC,
} from './config.js';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

const AppView = {
  map: '',
  mapEvent: '',
  workouts: [],
  mapZoomLevel: MAX_ZOOM,
};

//Render map on the screen.
export const renderMap = function (position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  const coords = [latitude, longitude];

  //Renders map.
  AppView.map = L.map('map').setView(coords, AppView.mapZoomLevel);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(AppView.map);

  // console.log('hi');
  // console.log(AppView.map);

  //Shows workout form.
  AppView.map.addEventListener('click', showForm);
};

//Rendering Workout marker.
export const renderWorkoutMarker = function (workout) {
  L.marker(workout.coords)
    .addTo(AppView.map)
    .bindPopup(
      L.popup({
        maxWidth: POPUP_MAX_WIDTH,
        maxHeight: POPUP_MAX_HEIGHT,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`,
      })
    )
    .setPopupContent(`${workout.setDescription}`)
    .openPopup();
};

//Showing up of form when clicked on the map.
const showForm = function (e) {
  // console.log(e);
  AppView.mapEvent = e;
  form.classList.remove('hidden');
  inputDistance.focus();
};

//Subscriber for New Workouts.
export const addHandlerNewWorkout = function (helper) {
  form.addEventListener('submit', helper);
};

//Change of workout type.
export const addHandlerToggleWorkout = function () {
  inputType.addEventListener('change', toggleElevationField);
};

//Update UI for Workout change.
const toggleElevationField = function (e) {
  e.preventDefault();
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
};

//Return form data to controller to validate.
export const fetchFormData = function () {
  const formData = {
    type: inputType.value,
    coords: AppView.mapEvent.latlng,
    distance: inputDistance.value,
    duration: inputDuration.value,
    cadence: inputCadence.value,
    elevation: inputElevation.value,
  };

  return formData;
};

//Clear form data.
export const hideForm = function () {
  form.classList.add('hidden');
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';
};

//Render Error
export const renderError = function (msg) {
  alert(msg);
};

//Render Workouts
export const renderWorkout = function (workout) {
  let copyHTML = `
  <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.setDescription}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${
        workout.type === 'running'
          ? workout.pace.toFixed(1)
          : workout.speed.toFixed(1)
      }</span>
      <span class="workout__unit">min/km</span>
    </div>          
      <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${
        workout.type === 'running' ? workout.cadence : workout.elevationGain
      }</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>`;
  form.insertAdjacentHTML('afterend', copyHTML);
};
