import Entity from 'entities/entity';

export default class Sprite extends Entity {
  constructor(image, x, y, width=image.width, height=image.height) {
    super(image, x, y, width, height);
    this.clip = {width, height};
  }

  draw(context) {
    let points = this.polygon.points;
    context.drawImage(image, points[0].x - this.camera.x,
                             points[0].y - this.camera.y);
  }
}
