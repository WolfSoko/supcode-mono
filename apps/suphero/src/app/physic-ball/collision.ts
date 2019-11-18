import * as p5 from 'p5';
import {Vector} from 'vector2d';

export class Collision {

  constructor(private pos: Vector, private impulse: number) {
  }

  draw(canvas: p5) {
    const outer = canvas.color('yellow');
    outer.setAlpha(200);
    const inner = canvas.color('darkred');
    inner.setAlpha(200);
    const d = canvas.constrain(Math.floor(this.impulse / 100), 2, 50);
    const iterations = Math.min(10, d);
    for (let i = iterations; i > 0; i--) {
      const normStep = canvas.map(i, 1, iterations, 0, 1);
      const lerpedColor = canvas.lerpColor(inner, outer, normStep);
      canvas.fill(lerpedColor);
      canvas.circle(this.pos.x, this.pos.y, normStep * d);
    }
  }

}
