import * as p5 from 'p5';
import {AbstractVector, Vector} from 'vector2d';
import {Collision} from './collision';
import apply = Reflect.apply;

export class Ball {

  _a: Vector = new Vector(0, 0);
  _v: Vector = new Vector(0, 0);
  _p: Vector = new Vector(0, 0);
  mass = 0;
  radius = 0;
  hadCollision = false;
  private pointOfCollision: AbstractVector;
  private impulseOfCollision: number;

  constructor(x: number, y: number, private size: number, private restitution = 0.7, private r, private g, private b) {
    this._p = new Vector(x, y);
    this._a = new Vector(Math.random() * 20, Math.random() * 20);
    this.radius = size / 2.;
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
    canvas.noStroke();
    const color = canvas.color(this.r, this.g, this.b);
    if (this.hadCollision) {
      const white = canvas.color('white');
      canvas.fill(canvas.lerpColor(color, white, 0.6));

      this.hadCollision = false;
    } else {
      canvas.fill(color);
    }
    canvas.circle(this.p.x, this.p.y, this.size);
    if (this.pointOfCollision) {
      canvas.push();
      canvas.fill('yellow');
      canvas.circle(this.pointOfCollision.x, this.pointOfCollision.y, this.impulseOfCollision);
      canvas.pop();
      this.pointOfCollision = null;
    }
  }

  updatePosition(timeStep: number) {
    this.v = this.v.add(this.a.divideByScalar(this.mass));
    this.p = this.p.add(this.v.multiplyByScalar(timeStep));

    this.a = new Vector(0, 0);
  }

  applyForce(v) {
    this.a = this.a.add(v);
  }

  handleWallCollision(left: number, top: number, right: number, bottom: number) {
    if (this.p.x - this.radius <= left && this.v.x < 0) {
      this.v = this.v.multiplyByVector(new Vector(-this.restitution, 1));
      this.p = this.p.setX(this.radius - 1);

    } else if (this.p.x + this.radius >= right && this.v.x > 0) {
      this.v = this.v.multiplyByVector(new Vector(-this.restitution, 1));
      this.p = this.p.setX(right - this.radius - 1);
    } else if (this.p.y + this.radius >= bottom && this.v.y > 0) {
      this.v = this.v.multiplyByVector(new Vector(1, -this.restitution));
      this.p = this.p.setY(bottom - this.radius - 1);
    } else if (this.p.y - this.radius <= top && this.v.y < 0) {
      this.v = this.v.multiplyByVector(new Vector(1, -this.restitution));
      this.p = this.p.setY(this.radius - 1);
    }
  }

  hasCollisionWith(other: Ball): boolean {
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
    const mtd = delta.clone().multiplyByScalar(((this.radius + other.radius) - d) / d);

    // resolve intersection --
    // inverse mass quantities
    const im1 = 1 / this.mass;
    const im2 = 1 / other.mass;
    const massSum = im1 + im2;

    // push-pull them apart based off their mass
    this.p = this.p.add(mtd.clone().multiplyByScalar(im1 / massSum));
    other.p = other.p.subtract(mtd.clone().multiplyByScalar(im2 / massSum));


    // impact speed
    const v = (this.v.subtract(other.v));
    const vn = v.dot(mtd.clone().normalize());

    // sphere intersecting but moving away from each other already
    if (isNaN(vn) || vn > 0.0) {
      return false;
    }

    this.hadCollision = true;
    other.hadCollision = true;

    // collision impulse
    const i = (-(1.0 + ((this.restitution + other.restitution) / 2)) * vn) / massSum;

    const impulse = mtd.clone().normalize().multiplyByScalar(i);
    // change in momentum
    this.v = this.v.add(impulse.clone().multiplyByScalar(im1));
    other.v = other.v.subtract(impulse.clone().multiplyByScalar(im2));

    const impulseOfCollision = impulse.length();
    const pointOfCollision = this.p.add(delta.clone().normalise().multiplyByScalar(-this.radius));
    return new Collision(pointOfCollision, impulseOfCollision);
  }
}
