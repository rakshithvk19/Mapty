import Workout from './workout.js';
import * as model from './model.js';

export class Running extends Workout {
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

//Return the new workout instance and push the instance to workout array.
export const updateRunningWorkout = function (data) {
  if (data.type !== 'running') return;

  const { lat, lng } = data.coords;
  const distance = Number(data.distance);
  const duration = Number(data.distance);
  const cadence = Number(data.cadence);

  const workout = new Running([lat, lng], distance, duration, cadence);
  model.workoutArr.push(workout);
  return workout;
};
