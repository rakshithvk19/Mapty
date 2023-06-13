import * as view from './view';
import * as cyclingModel from './model/cycling.js';
import * as runningModel from './model/running.js';
import { workoutInstanceArr as workoutArr } from './model/model.js';

//Set Local Storage.
const setLocalStorage = function (workout) {
  localStorage.setItem('workouts', JSON.stringify(workout));
};

//Publisher for New workouts.
const controlNewWorkout = function (e) {
  e.preventDefault();
  const data = view.fetchFormData();
  let msg = cyclingModel.cycling.validateNewCyclingWorkout(data);
  msg += runningModel.running.validateNewRunningWorkout(data);
  if (msg) {
    view.renderError(msg);
    return;
  }

  let workout = cyclingModel.updateCyclingWorkout(data);
  if (!workout) {
    workout = runningModel.updateRunningWorkout(data);
  }
  view.renderWorkoutMarker(workout);
  view.renderWorkout(workout);
  view.hideForm();
  setLocalStorage(workoutArr);
};

//Render Local Storage.
const renderLocalStorage = function () {
  const workoutData = JSON.parse(localStorage.getItem('workouts'));
  if (!workoutData) return;

  workoutData.forEach(eachWorkout => {
    view.renderWorkoutMarker(eachWorkout);
    view.renderWorkout(eachWorkout);
  });
};

//Gets the user's current position from navigator API and render Map.
const loadMap = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(view.renderMap);
  }
};

const init = function () {
  loadMap();
  renderLocalStorage();
  view.addHandlerNewWorkout(controlNewWorkout);
  view.addHandlerToggleWorkout();
};
init();
