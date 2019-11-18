import {GravityBall} from '@supcode-mono/api-interfaces';
import * as p5 from 'p5';
import {Vector} from 'vector2d';
import {Collision} from './collision';

export class Ball implements GravityBall {

  _a: Vector = new Vector(0, 0);
  _v: Vector = new Vector(0, 0);
  _p: Vector = new Vector(0, 0);
  angA = 0;
  angV = 0;
  ang = 0;
  mass = 0;
  radius = 0;

  constructor(x: number, y: number, public diameter: number, private restitution = 0.7, public r, public g, public b) {
    this._p = new Vector(x, y);
    this._v = new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10);
    this.angV = Math.random();
    this.radius = diameter / 2.;
    this.mass = this.radius * this.radius * Math.PI;
  }

  get p(): Vector {
    return this._p.clone() as Vector;
  }

  set p(p: Vector) {
    this._p = p;
  }

  get v(): Vector {
    return this._v.clone() as Vector;
  }

  set v(v: Vector) {
    this._v = v;
  }

  get a(): Vector {
    return this._a.clone() as Vector;
  }

  set a(a: Vector) {
    this._a = a;
  }

  draw(canvas: p5) {
    canvas.push();
    const {x, y} = this._p;
    canvas.translate(canvas.createVector(x, y));
    canvas.rotate(this.ang);
    canvas.noStroke();
    const color = canvas.color(this.r, this.g, this.b);
    canvas.fill(color);
    canvas.circle(0, 0, this.diameter);
    canvas.stroke(125);
    canvas.line(0, 0, 0, -this.radius);
    canvas.translate(canvas.createVector(-x, -y));
    canvas.pop();
  }

  updatePosition(timeStep: number) {
    this.v = this.v.add(this.a.divideByScalar(this.mass).multiplyByScalar(timeStep));
    this.p = this.p.add(this.v.multiplyByScalar(timeStep));
    this.a = new Vector(0, 0);

    this.angV = this.angV + (this.angA / this.mass) * timeStep;
    this.ang = this.ang + (this.angV * timeStep);
    this.angA = 0;
  }

  applyForce(acc: Vector) {
    this.a = this.a.add(acc);
  }

  handleWallCollision(left: number, top: number, right: number, bottom: number) {
    const {x: px} = this.p;
    const {x: vx} = this.v;
    const leftEdge = px - this.radius;
    const allowed = 0.01;
    const percentCorrecting = 0.2;
    const leftPenetration = left - leftEdge;
    if (leftPenetration > allowed ) {
      this.p.setX(this.p.x + (leftPenetration) * percentCorrecting);
      if( vx < 0){
        this.v = this.v.multiplyByVector(new Vector(-this.restitution, 1));
      }
    } else if (px + this.radius >= right && vx > 0) {
      this.v = this.v.multiplyByVector(new Vector(-this.restitution, 1));
      this.p = this.p.setX(right - this.radius);
    } else if (this.p.y + this.radius >= bottom && this.v.y > 0) {
      this.v = this.v.multiplyByVector(new Vector(1, -this.restitution));
      this.p = this.p.setY(bottom - this.radius);
    } else if (this.p.y - this.radius <= top && this.v.y < 0) {
      this.v = this.v.multiplyByVector(new Vector(1, -this.restitution));
      this.p = this.p.setY(this.radius);
    }
  }

  hasCollisionWith(other: Ball): boolean {
    if (this === other) {
      return false;
    }

    const xd = this.p.getX() - other.p.getX();
    const yd = this.p.getY() - other.p.getY();

    const sumRadius = this.radius + other.radius;
    const sqrRadius = sumRadius * sumRadius;

    const distSqr = (xd * xd) + (yd * yd);

    if (distSqr <= sqrRadius) {
      return true;
    }
    return false;
  }

  handleCollisionWith(other: Ball) {
    if (!this.hasCollisionWith(other)) {
      return false;
    }

    // get the mtd
    const delta = (this.p.subtract(other.p));
    const d = delta.length();

    // minimum translation distance to push balls apart after intersecting
    const mtd = delta.clone().multiplyByScalar((((this.radius + other.radius) - d) / d) * 0.8);

    // resolve intersection --
    // inverse mass quantities
    const im1 = 1 / this.mass;
    const im2 = 1 / other.mass;
    const massSum = im1 + im2;

    // push-pull them apart based off their mass
    other.p = other.p.subtract(mtd.clone().multiplyByScalar(im2 / massSum));
    this.p = this.p.subtract(mtd.clone().multiplyByScalar(-im1 / massSum));

    // impact speed
    const v = (this.v.subtract(other.v));
    const vn = v.dot(mtd.clone().normalize());

    // sphere intersecting but moving away from each other already
    if (isNaN(vn) || vn > 0.0) {
      return false;
    }

    // collision impulse
    const i = (-(1.0 + (Math.min(this.restitution, other.restitution))) * vn) / massSum;

    const impulse = mtd.clone().normalize().multiplyByScalar(i);

    // change in momentum
    other.v = other.v.subtract(impulse.clone().multiplyByScalar(im2));

    const impulseOfCollision = impulse.length();

    // position correction
    const pointOfCollision = this.p.add(delta.clone().normalise().multiplyByScalar(-this.radius));
    return new Collision(pointOfCollision, impulseOfCollision);
  }
}
