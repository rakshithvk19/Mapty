import Workout from './workout.js';
import * as model from './model.js';

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }

  //Validate cadence for running.
  validateNewRunningWorkout(data) {
    let msg = '';
    if (data.type === 'running') {
      msg = super.validateNewWorkout(data);

      if (Number.isNaN(data.cadence)) {
        msg += 'Please enter Cadence as a number. \n';
      } else if (data.cadence <= 0) {
        msg += 'Please enter Cadence as a positive value. \n';
      }
    }
    return msg;
  }
}

export const running = new Running();

export const updateRunningWorkout = function (data) {
  if (data.type !== 'running') return;

  const distance = Number(data.distance);
  const duration = Number(data.distance);
  const cadence = Number(data.cadence);

  const workout = new Running('', distance, duration, cadence);
  model.workoutInstanceArr.push(workout);
  console.log(model.workoutInstanceArr);
};
