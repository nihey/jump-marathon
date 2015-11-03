import Timer from 'timer';

export default class Camera {
  constructor(canvas, x=0, y=0) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;

    // Physics options
    this.timer = new Timer();
    this.acceleration = {x: 0, y: 0, angular: 0};
    this.speed = {x: 0, y: 0, angular: 0};
  }

  move(x=0, y=0) {
    this.x += x;
    this.x += y;
  }

  physics() {
    let elapsed = this.timer.elapsed();

    // Change speed
    this.speed.x += elapsed * this.acceleration.x;
    this.speed.y += elapsed * this.acceleration.y;

    // Move the camera
    this.move(this.speed.x * elapsed, this.speed.y * elapsed);

    this.timer.reset();
  }
}
