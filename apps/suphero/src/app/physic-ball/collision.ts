import * as p5 from 'p5';
import {Vector} from 'vector2d';

export class Collision {

  constructor(private pos: Vector, private impulse: number) {
  }

  draw(canvas: p5) {
    const outer = canvas.color('yellow');
    const inner = canvas.color('darkred');
    const d = Math.floor(this.impulse / 100);
    const iterations = Math.min(10, d);
    for (let i = iterations; i > 0; i--) {
      const normStep = canvas.map(i, 1, iterations, 0, 1);
      const lerpedColor = canvas.lerpColor(inner, outer, normStep);
      canvas.fill(lerpedColor);
      canvas.circle(this.pos.x, this.pos.y, normStep * d);
    }
  }

}
