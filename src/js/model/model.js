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
}
