import Rectangle from 'polygons/rectangle';

export default class Entity {
  constructor(image, x, y, width=image.width, height=image.height) {
    this.polygon = new Rectangle(x, y, width, height);
    this.image = image;
    this.camera = window.camera || {x: 0, y: 0};
  }

  collides(entity) {
    this.polygon.collides(entity.polygon);
  }

  draw(context) {
    let points = this.polygon.points;
    context.drawImage(this.image, points[0].x - this.camera.x,
                                  points[0].y - this.camera.y);
  }

  render(context) {
    this.polygon.physics();
    this.draw(context);
  }
}
