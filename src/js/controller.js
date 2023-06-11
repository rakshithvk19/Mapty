import * as view from './view';
import * as cyclingModel from './model/cycling.js';
import * as runningModel from './model/running.js';

//Gets the user's current position from navigator API and render Map.
const loadMap = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(view.renderMap);
  }
};

//Fetch Data that are stored in local storage.
const getLocalStorage = function () {
  const workoutData = JSON.parse(localStorage.getItem('workouts'));
  if (!workoutData) return;

  //For each workout, render workout.
};

//Publisher for New workouts.
const controlNewWorkout = function (e) {
  e.preventDefault();
  const data = view.fetchFormData();
  let msg = cyclingModel.cycling.validateNewCyclingWorkout(data);
  msg += runningModel.running.validateNewRunningWorkout(data);
  if (msg) {
    view.renderError(msg);
  } else {
    cyclingModel.updateCyclingWorkout(data);
    runningModel.updateRunningWorkout(data);
  }
};

const init = function () {
  loadMap();
  view.addHandlerNewWorkout(controlNewWorkout);
  view.addHandlerToggleWorkout();
};
init();
