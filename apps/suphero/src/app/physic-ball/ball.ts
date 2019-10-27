import {AbstractVector, Vector} from 'vector2d';

export class Ball {

  a: Vector = new Vector(0, 0);
  v: Vector = new Vector(0, 0);
  p: Vector = new Vector(0, 0);
  mass = 0;
  radius = 0;


  constructor(x: number, y: number, private size: number, private elasticity = 0.7, private r, private g, private b) {
    this.p = new Vector(x, y);
    this.radius = size / 2.;
    this.mass = size * size * Math.PI;
  }

  draw(canvas: any) {
    canvas.noStroke();
    canvas.fill(this.r, this.g, this.b);
    canvas.circle(this.p.x, this.p.y, this.size);
  }

  updatePosition(timeStep: number) {
    this.v.add(this.a.divideByScalar(this.mass));
    this.p.add(this.v.clone().multiplyByScalar(timeStep));
    this.a = new Vector(0, 0);
  }

  applyForce(v) {
    this.a.add(v);
  }

  handleCollision(left: number, top: number, right: number, bottom: number) {
    if (this.p.x - this.radius < left && this.v.x < 0) {
      this.v.multiplyByVector(new Vector(-this.elasticity, 1));
      this.p.setX(this.radius);
    }
    if (this.p.x + this.radius > right && this.v.x > 0) {
      this.v.multiplyByVector(new Vector(-this.elasticity, 1));
      this.p.setX(right - this.radius);
    }
    if (this.p.y + this.radius > bottom && this.v.y > 0) {
      this.v.multiplyByVector(new Vector(1, -this.elasticity));
      this.p.setY(bottom - this.radius);
    }

    if (this.p.y - this.radius < top && this.v.y < 0) {
      this.v.multiplyByVector(new Vector(1, -this.elasticity));
      this.p.setY(this.radius);
    }
  }

  checkCollision(other: Ball) {
    if (this.p.distance(other.p) > this.radius + other.radius) {
      return;
    }
    // Vector perpendicular to (x, y) is (-y, x)
    const tangentVec = new Vector((other.p.y - this.p.y), -(other.p.x - this.p.x));
    tangentVec.normalise();

    const relativeVelocity = this.v.clone().subtract(other.v);
    const length = relativeVelocity.dot(tangentVec);
    const velocityComponentOnTangent = tangentVec.clone().multiplyByScalar(length);
    const velocityComponentPerpendicularToTangent = relativeVelocity.clone().subtract(velocityComponentOnTangent);

    this.v.subtract(velocityComponentPerpendicularToTangent);
    other.v.add(velocityComponentPerpendicularToTangent)
  }

  getP(): AbstractVector {
    return this.p.clone();
  }
}
