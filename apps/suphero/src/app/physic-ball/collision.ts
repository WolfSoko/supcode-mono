import * as p5 from 'p5';
import {Vector} from 'vector2d';

export class Collision {

  constructor(private pos: Vector, private impulse: number) {
  }

  draw(canvas: p5) {
    canvas.fill('lightyellow');
    canvas.circle(this.pos.x, this.pos.y, this.impulse / 100);
  }

}
