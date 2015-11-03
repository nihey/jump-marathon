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
  }

  jump() {
    this.polygon.speed.y = -0.7;
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
