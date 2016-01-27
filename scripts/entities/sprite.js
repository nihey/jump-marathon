import Entity from 'entities/entity';

export default class Sprite extends Entity {
  constructor(image, x, y, width=image.width, height=image.height, dx=x, dy=y, dw=width, dh=height, clips=[], frequency=10) {
    super(image, x, y, width, height, dx, dy, dw, dh);

    this.clock = 1;
    this.index = 0;
    this.clips = clips;
    this.indexes = clips.map((o, i) => i);
    this.frequency = frequency;

    this.polygon.acceleration.y = 0.002;

    this._released = true;
    this.jumpSettings = {
      speed: 0.83,  // speed increase
      time: 130,    // Jump up cycle duration (ms)
      _jumping: false,
      _startTime: null,
      _updateTime: null,
    };
  }

  escalate(x) {
    // Quadratic jump growth over time
    return -x*x + x*2*this.jumpSettings.time;
  }

  onPhysics() {
    if (new Date() - this.jumpSettings._startTime > this.jumpSettings.time ||
        !this.jumpSettings._jumping) {
      return;
    }

    // How much time has passed since the last jump frame
    let x = new Date() - this.jumpSettings._startTime;
    let dx = x - (new Date() - this.jumpSettings._updateTime);

    // Calculate how much we should increment the jump
    let delta = this.escalate(x) - this.escalate(dx);
    let max = this.escalate(this.jumpSettings.time);
    this.polygon.speed.y -= (delta / max) * this.jumpSettings.speed;

    // Update the jumping time
    this.jumpSettings._updateTime = new Date();
  }

  jump() {
    if (!this._released) {
      return;
    }

    this._released = false;
    this.jumpSettings._jumping = true;
    this.jumpSettings._startTime = new Date();
    this.jumpSettings._updateTime = new Date();
    this.polygon.speed.y = 0;
  }

  dejump() {
    this.jumpSettings._jumping = false;
    this._released = true;
  }

  draw(context) {
    if ((this.clock++ % this.frequency) === 0) {
      this.index = (this.index + 1) % this.indexes.length;
    }

    let points = this.polygon.points;
    let clip = this.clips[this.indexes[this.index]];
    context.drawImage(this.image, ...clip,
      points[0].x - this.camera.x, points[0].y - this.camera.y,
      this.box.width, this.box.height
    );
  }
}
