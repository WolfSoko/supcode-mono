import * as P5 from 'p5';

export class Ball {

  private ax = 0;
  private ay = 0;
  private vx = 0;
  private vy = 0;
   mass = 0;
  private radius = 0;


  constructor(public x, public y, private size, private elasticity = 0.7, private r, private g, private b) {
    this.radius = size / 2.;
    this.mass = size * size * Math.PI;
  }

  draw(canvas: P5) {
    canvas.noStroke();
    canvas.fill(this.r, this.g, this.b);
    canvas.circle(this.x, this.y, this.size);
  }

  updatePosition(timeStep: number) {
    this.vx = this.vx + this.ax / this.mass;
    this.vy = this.vy + this.ay / this.mass;
    this.x = this.x + this.vx * timeStep;
    this.y = this.y + this.vy * timeStep;
    this.ax = 0;
    this.ay = 0;
  }

  applyForce(x, y) {
    this.ax = this.ax + x;
    this.ay = this.ay + y;
  }
  handleCollision(left: number, top: number, right: number, bottom: number) {
    if (this.x - this.radius < left && this.vx < 0) {
      this.vx = -this.vx * this.elasticity;
      this.x = this.radius;
    }
    if (this.x + this.radius >= right && this.vx > 0) {
      this.vx = -this.vx * this.elasticity;
      this.x = right - this.radius;
    }
    if (this.y + this.radius >= bottom && this.vy > 0) {
      this.vy = -this.vy * this.elasticity;
      this.y = bottom - this.radius;
    }
    if (this.y - this.radius <= top && this.vy < 0) {
      this.vy = -this.vy * this.elasticity;
      this.y = this.radius;
    }
  }

  constrain(xMin: number, yMin: number, xMax: number, yMax: number) {
    if (this.x < xMin) {
      this.x = xMin;
    }
    if (this.x > xMax) {
      this.x = xMax;
    }
    if (this.y < yMin) {
      this.y = yMin;
    }
    if (this.y > yMax) {
      this.y = yMax;
    }
  }
}
