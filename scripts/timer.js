export default class Timer {
  constructor() {
    this.reset();
  }

  elapsed() {
    return new Date() - this.start;
  }

  reset() {
    this.start = new Date();
  }
}
