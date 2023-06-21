import Workout from './workout.js';
import * as model from './model.js';

export class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }

  //Validate elevation gain for cycling.
  validateNewCyclingWorkout(data) {
    let msg = '';
    if (data.type === 'Cycling') {
      msg = super.validateNewWorkout(data);
      console.log(msg);
      if (Number.isNaN(data.elevation)) {
        msg += 'Please enter elevation gain as a number. \n';
      }
    }
    return msg;
  }
}

export const cycling = new Cycling();

//Return the new workout instance and push the instance to workout array.
export const updateCyclingWorkout = function (data) {
  if (data.type !== 'cycling') return;

  const { lat, lng } = data.coords;
  const distance = Number(data.distance);
  const duration = Number(data.distance);
  const elevation = Number(data.elevation);

  const workout = new Cycling([lat, lng], distance, duration, elevation);
  model.workoutArr.push(workout);
  return workout;
};
