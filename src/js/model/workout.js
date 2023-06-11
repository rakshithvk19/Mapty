export default class Workout {
  date = new Date();
  id = String(Date.now()).slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.setDescription = `${this.type[0].toUpperCase()}${this.type.slice(
      1
    )} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    // return this.setDescription;
  }

  _clicks() {
    this.clicks++;
  }

  //Validate distance and duration for all workouts.
  validateNewWorkout(data) {
    let msg = '';

    if (Number.isNaN(data.distance)) {
      msg += 'Please enter Distance as a number. \n';
    } else if (data.distance <= 0) {
      msg += 'Please enter Distance as a positive value. \n';
    }

    if (Number.isNaN(data.duration)) {
      msg += 'Please enter Duration as a number. \n';
    } else if (data.duration <= 0) {
      msg += 'Please enter Duration as a positive value. \n';
    }

    return msg;
  }
}
