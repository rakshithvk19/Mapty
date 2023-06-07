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

  //Shows workout form.
  AppView.map.addEventListener('click', showForm());
};

const showForm = function (e) {
  AppView.mapEvent = e;
  form.classList.remove('hidden');
  inputDistance.focus();
};

class app {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = MAX_ZOOM;

  constructor() {
    this._getPosition();

    this._getLocalStorage();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  //Loads the map onto the screen.
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //Handling Map click events
    this.#map.on('click', this._showForm.bind(this));

    //Rendering workout marker
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _hideForm() {
    form.classList.add('hidden');
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }

  _toggleElevationField(e) {
    e.preventDefault();
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    const validate = function (distance, duration, type, gainOrcadence) {
      // check for number
      // check for negative
      let msg = '';
      if (Number.isNaN(distance)) {
        msg += 'Please enter Distance as a number. \n';
      } else if (distance < 0) {
        msg += 'Please enter Distance as a positive value. \n';
      }

      if (Number.isNaN(duration)) {
        msg += 'Please enter Duration as a number. \n';
      } else if (duration < 0) {
        msg += 'Please enter Duration as a positive value. \n';
      }

      if (type === 'running') {
        if (Number.isNaN(gainOrcadence)) {
          msg += 'Please enter Cadence as a number. \n';
        } else if (gainOrcadence < 0) {
          msg += 'Please enter Cadence as a positive value. \n';
        }
      } else if (type === 'cycling') {
        if (Number.isNaN(gainOrcadence)) {
          msg += 'Please enter Gain as a number. \n';
        }
      }
      return msg;
    };

    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    let msg = '';

    if (type === 'running') {
      const cadence = Number(inputCadence.value);
      msg = validate(distance, duration, type, cadence);
      if (msg != '') {
        alert(msg);
        return;
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevationGain = Number(inputElevation.value);
      msg = validate(distance, duration, type, elevationGain);
      if (msg != '') {
        alert(msg);
        return;
      }
      workout = new Cycling([lat, lng], distance, duration, elevationGain);
    }
    this.#workouts.push(workout);

    this._renderWorkoutMarker(workout);

    this._renderWorkout(workout);

    this._hideForm();

    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
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
  }

  _renderWorkout(workout) {
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
        </div>`;

    if (workout.type === 'running') {
      copyHTML += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
            <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    } else if (workout.type === 'cycling') {
      copyHTML += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
      </li> `;
    }
    form.insertAdjacentHTML('afterend', copyHTML);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;
    const workout = this.#workouts.find(function (el) {
      return el.id === workoutEl.dataset.id;
    });
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: PAN_DURATION_SEC },
    });

    workout._clicks();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  //Gets the data stored in local storage.
  _getLocalStorage() {
    const workoutData = JSON.parse(localStorage.getItem('workouts'));
    if (!workoutData) return;
    this.#workouts = workoutData;
    const appObj = this;
    this.#workouts.forEach(function (eachWorkout) {
      appObj._renderWorkout(eachWorkout);
    });
  }
}

// export default new App();
