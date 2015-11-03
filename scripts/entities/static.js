import Entity from 'entities/entity';

export default class StaticEntity extends Entity {
  render(context) {
    this.draw(context);
  }
}
