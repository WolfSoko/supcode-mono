import {GravityBall, GravityWorldOptions} from '@supcode-mono/api-interfaces';
import {BehaviorSubject, interval, Observable, Subject, timer} from 'rxjs';
import {map, share, tap} from 'rxjs/operators';
import {Vector} from 'vector2d';
import {Ball} from '../../../../suphero/src/app/physic-ball/ball';
import {Collision} from '../../../../suphero/src/app/physic-ball/collision';
import {Box, Circle, Point, QuadTree} from 'js-quadtree';

export function createDefaultPhysicsBallOption(): GravityWorldOptions {
  return {
    ballsAmount: 5,
    ballSize: 30,
    gravityEnabled: true,
    gravityForce: 0.9,
    restitution: 0.9,
    wallsEnabled: true,
    collisionsEnabled: true,
    width: 640,
    height: 420,
    iterations: 5,
    speed: 10,
    drawCollisionEffect: true,
    quadTreeBoxCapacity: 4,
    ballsGravityEnabled: true,
    gravityConstant: 6.75,
    drawTails: true
  };
}

export class GravityWorldService {

  private balls: Ball[] = [];
  private gravityBalls$: Observable<GravityBall[]>;
  private options$: Observable<GravityWorldOptions>;
  private physicsBallOptions$: BehaviorSubject<GravityWorldOptions>;
  private quadTree: QuadTree;
  private collisions: Collision[];

  constructor() {
    this.physicsBallOptions$ = new BehaviorSubject<GravityWorldOptions>(createDefaultPhysicsBallOption());
    this.options$ = this.physicsBallOptions$.asObservable().pipe(share());
    this.quadTree = new QuadTree();
  }

  private buildClock(frameApproximateLength: number): Observable<number> {
    let t0 = Date.now();
    let t1: number;
    return timer(0, frameApproximateLength).pipe(
      tap(() => t1 = Date.now()),
      map(() => t1 - t0),
      tap(() => t0 = t1)
    );
  }

  updateOptions(options: GravityWorldOptions): void {
    const value = this.physicsBallOptions$.getValue();
    this.physicsBallOptions$.next({...value, ...options});
  }

  selectOptions() {
    return this.options$;
  }

  selectBalls(): Observable<GravityBall[]> {
    if (this.gravityBalls$ == null) {
      this.gravityBalls$ = this.buildClock(Math.floor(1000 / 40))
        .pipe(
          map((dT) => this.nextStep(dT)),
          share()
        );
    }
    return this.gravityBalls$;
  }

  private addBall(ballSize) {
    const size = Math.max(ballSize * Math.random(), 3);
    const {height, width, restitution} = this.physicsBallOptions$.getValue();
    const newBall = new Ball(Math.random() * width, Math.random() * height, size, restitution, Math.random() * 255, Math.random() * 255, Math.random() * 255);
    if (this.balls.every(value => !newBall.hasCollisionWith(value))) {
      this.balls.push(newBall);
    }
  }

  private removeBall() {
    if (this.balls.length > 1) {
      const numberOfElementsToRemove = this.balls.length - this.physicsBallOptions$.getValue().ballsAmount;
      this.balls.splice(this.balls.length - numberOfElementsToRemove - 1, numberOfElementsToRemove);
    }
  }


  private nextStep(dT: number) {
    const {ballsAmount, ballSize, gravityEnabled, gravityForce, wallsEnabled, collisionsEnabled, ballsGravityEnabled, iterations, speed, drawCollisionEffect, gravityConstant, width, height} = this.physicsBallOptions$.getValue();
    this.adjustBallsLength(ballsAmount, ballSize);

    this.collisions = [];
    for (let iter = 0; iter < iterations; iter++) {
      for (const ball of this.balls) {
        /*if (canvas.mouseIsPressed) {
          const mP = new Vector(canvas.mouseX, canvas.mouseY);
          const direction = ball.p.subtract(mP);
          const rPow = direction.lengthSq();

          if (rPow > 0) {
            const f = gravityConstant * (10000 + ball.mass) / rPow;
            const a = direction.normalise().multiplyByScalar(-f / iterations);
            ball.applyForce(a);
          }
        }*/
        if (ballsGravityEnabled) {
          for (const ball2 of this.balls) {
            if (ball === ball2) {
              continue;
            }
            const direction = ball.p.subtract(ball2.p);
            const rPow = direction.lengthSq();

            if (rPow > 0) {
              const f = gravityConstant * (ball2.mass + ball.mass) / rPow;
              const a = direction.normalise().multiplyByScalar(-f / iterations);
              ball.applyForce(a);
              ball2.applyForce(a.multiplyByScalar(-1));
            }
          }
        }


        if (gravityEnabled) {
          ball.applyForce(new Vector(0, gravityForce * ball.mass));
        }
        ball.updatePosition((dT * speed) / 1000 / iterations);

        if (collisionsEnabled) {
          this.updateQuadTree();
          const {p: {x, y}, radius: r} = ball;
          const ballsToCheck = this.quadTree.query(new Circle(x, y, r + ballSize));
          for (let i = 0; i < ballsToCheck.length - 1; i++) {
            const ball1 = this.balls[ballsToCheck[i].data.index];
            for (let j = i+1 ; j < ballsToCheck.length; j++) {
              const ball2 = this.balls[ballsToCheck[j].data.index];
              const collisionResult = ball1.handleCollisionWith(ball2);
              if (collisionResult && drawCollisionEffect) {
                this.collisions.push(collisionResult);
              }
            }
          }
        }
      }
      if (wallsEnabled) {
        this.updateQuadTree();

        /**
         *  lllluuuuuuuuuuuuuuuuuu
         *  lllluuuuuuuuuuuuuuuuuu
         *  llll   O    o   rrrrrr
         *  llll     o      rrrrrr
         *  ddddddddddddddddrrrrrr
         *  ddddddddddddddddrrrrrr
         */
        const wallCollisionDistance = Math.max(ballSize, 10);
        const widthMinusBallSize = width - wallCollisionDistance;
        const heightMinusBallSize = height - wallCollisionDistance;

        const wallSafetyArea = 1000000;
        const up = new Box(wallCollisionDistance, -wallSafetyArea, +wallSafetyArea, +wallSafetyArea + wallCollisionDistance);
        const right = new Box(widthMinusBallSize, wallCollisionDistance, wallSafetyArea, wallSafetyArea);
        const down = new Box(-wallSafetyArea, heightMinusBallSize, wallSafetyArea + widthMinusBallSize, wallSafetyArea);
        const left = new Box(-wallSafetyArea, -wallSafetyArea, +wallSafetyArea + wallCollisionDistance, wallSafetyArea + heightMinusBallSize);
        const wallsToCheck = [down, left, up, right];

        for (const wall of wallsToCheck) {
          const queryResult = this.quadTree.query(wall);
          for (const point of queryResult) {
            this.balls[point.data.index].handleWallCollision(0, 0, width, height);
          }
        }
      }
    }
    return this.balls;
  }

  private adjustBallsLength(ballsAmount: number, ballSize: number) {
    const length = this.balls.length;
    if (length < ballsAmount) {
      this.addBall(ballSize);
    }
    if (length > ballsAmount) {
      this.removeBall();
    }
  }

  private updateQuadTree() {
    const points = [];
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      points.push(new Point(ball.p.x, ball.p.y, {index: i}));
    }
    const {quadTreeBoxCapacity} = this.physicsBallOptions$.getValue();
    this.quadTree = new QuadTree(new Box(-1000000, -1000000, 2000000, 2000000), {capacity: quadTreeBoxCapacity}, points);
  }
}

