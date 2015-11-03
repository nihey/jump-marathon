import Timer from 'timer';
import collides from 'collides';

export default class Polygon {
  constructor(points, style='#000') {
    // Polygon points
    this.points = points;

    // Drawing options
    this.style = style;

    // Physics options
    this.timer = new Timer();
    this.acceleration = {x: 0, y: 0, angular: 0};
    this.speed = {x: 0, y: 0, angular: 0};
  }

  /*
   * Physics
   */

  collides(polygon) {
    return collides(this.points, polygon.points);
  }

  moveTo(x, y) {
    let center = this.getCenter();
    x = x - center.x;
    y = y - center.y;
    this.move(x, y);
  }

  move(x, y) {
    for (let i = 0; i < this.points.length; ++i) {
      this.points[i].x += x;
      this.points[i].y += y;
    }
  }

  physics() {
    let elapsed = this.timer.elapsed();

    // Change speed
    this.speed.x += elapsed * this.acceleration.x;
    this.speed.y += elapsed * this.acceleration.y;
    this.speed.angular += elapsed * this.acceleration.angular;

    // Change position
    if (!this.speed.angular) {
      // If there is no angular motion, simply calculate common speed motion
      this.move(this.speed.x * elapsed, this.speed.y * elapsed);
    } else {
      // angular motion makes things a little more complicated, it requires an
      // anchor point on which we are rotation the polygon against (center)
      let center = this.getCenter();
      // Then we pre-calculate complex operations to avoid recalculating it on
      // the loop
      let angle = (this.speed.angular * elapsed) / 57.295779513,
          sin = Math.sin(angle),
          cos = Math.cos(angle);
      for (let i = 0; i < this.points.length; ++i) {
        // Translate the polygon back to the origin
        let translated = {
          x: this.points[i].x - center.x,
          y: this.points[i].y - center.y,
        };

        // Rotate the polygon and translate it back to its original point
        this.points[i].x = (translated.x * cos - translated.y * sin) + center.x;
        this.points[i].y = (translated.x * sin + translated.y * cos) + center.y;

        // Translate the polygon acording to its common speed
        this.points[i].x += this.speed.x * elapsed;
        this.points[i].y += this.speed.y * elapsed;
      }
    }

    this.timer.reset();
  }

  getCenter() {
    var center = {x: 0, y: 0};
    for (let i = 0; i < this.points.length; ++i) {
      center.x += this.points[i].x;
      center.y += this.points[i].y;
    }
    center.x /= this.points.length;
    center.y /= this.points.length;

    return center;
  }

  /*
   * Drawing
   */

  draw(context) {
    context.fillStyle = this.style;
    context.beginPath();

    // Draw polygon
    context.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; ++i) {
      context.lineTo(this.points[i].x, this.points[i].y);
    }
    context.lineTo(this.points[0].x, this.points[0].y);

    context.closePath();
    context.fill();
  }

  render(context) {
    this.physics();
    this.draw(context);
  }
}
