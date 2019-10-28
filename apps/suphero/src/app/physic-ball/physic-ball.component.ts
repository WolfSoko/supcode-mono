import {AfterContentInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PersistNgFormPlugin} from '@datorama/akita';
import {UntilDestroy} from '@ngneat/until-destroy';
import {Box, Circle, Point, QuadTree} from 'js-quadtree';
import * as P5 from 'p5';
import {interval, Subscription} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {Vector} from 'vector2d';
import {Ball, Sun} from './ball';
import {Collision} from './collision';
import {createDefaultPhysicsBallOption, PhysicBallOptions} from './physic-ball-options';
import {PhysicsBallQuery} from './state';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'sup-hero-physic-ball',
  templateUrl: './physic-ball.component.html',
  styleUrls: ['./physic-ball.component.scss']
})
export class PhysicBallComponent implements AfterContentInit, OnDestroy {
  balls: Ball[] = [];
  optionsForm: FormGroup;
  dataSource: { x: number; y: number; index: number }[] = [];
  quadTree: QuadTree;

  @ViewChild('physicsCanvas', {static: true}) canvasElemRef: ElementRef;
  debug: false;
  options: PhysicBallOptions;
  private updateDataSourceSub: Subscription;
  private p5Canvas: P5;
  private persistForm: PersistNgFormPlugin<any>;

  constructor(fb: FormBuilder, private physicsBallQuery: PhysicsBallQuery) {
    this.optionsForm = fb.group(createDefaultPhysicsBallOption());

    this.persistForm = new PersistNgFormPlugin(this.physicsBallQuery, 'options')
      .setForm(this.optionsForm);

    this.physicsBallQuery.selectOptions().subscribe(options => this.options = options);

    if (this.debug) {
      this.updateDataSourceSub = interval(200).subscribe(value => this.updateDataSource());
    }
    this.quadTree = new QuadTree();
  }

  ngAfterContentInit(): void {
    const options$ = this.physicsBallQuery.selectOptions();
    options$.pipe(
      distinctUntilChanged((
        {width: w1, height: h1}, {width: w2, height: h2}) =>
        w1 === w2 && h1 === h2
      )
    ).subscribe(
      ({width, height}) => this.adjustCanvasSize(width, height));

    this.createCanvas();
  }

  adjustBallsLength(ballsAmount: number, ballSize: number) {
    const length = this.balls.length;
    if (length < ballsAmount) {
      this.addBall(ballSize);
    }
    if (length > ballsAmount) {
      this.removeBall();
    }
  }

  addBall(ballSize) {
    const size = ballSize * Math.random();
    const {height, width, restitution} = this.options;
    const newBall = new Ball(Math.random() * width, Math.random() * height, size, restitution, Math.random() * 255, Math.random() * 255, Math.random() * 255);
    if (this.balls.every(value => !newBall.hasCollisionWith(value))) {
      this.balls.push(newBall);
    }
  }

  removeBall() {
    if (this.balls.length > 1) {
        const ball = this.balls.shift();
      if (ball instanceof Sun) {
        this.balls.push(ball)
      }
    }
  }

  private createCanvas() {
    const myP5 = new P5(p5Canvas =>
      this.sketch(p5Canvas), this.canvasElemRef.nativeElement);
  }

  private sketch(canvas: P5) {

    this.p5Canvas = canvas;

    canvas.setup = () => {
      const {height, width} = this.options;
      canvas.createCanvas(width, height);
      // this.balls.push(new Sun(width / 2, height / 2));
    };

    canvas.draw = () => {
      const {ballsAmount, ballSize, gravityEnabled, gravityForce, wallsEnabled, collisionsEnabled, ballsGravityEnabled, iterations, speed, drawCollisionEffect, gravityConstant, width, height} = this.options;
      canvas.background(20, 20, 20, 20);
      this.adjustBallsLength(ballsAmount, ballSize);

      const collisions: Collision[] = [];
      for (let iter = 0; iter < iterations; iter++) {
        for (const ball of this.balls) {
          if (canvas.mouseIsPressed) {
            const mP = new Vector(canvas.mouseX, canvas.mouseY);
            const direction = ball.p.subtract(mP);
            const rPow = direction.lengthSq();

            if (rPow > 0) {
              const f = gravityConstant * (10000 + ball.mass) / rPow;
              const a = direction.normalise().multiplyByScalar(-f / iterations);
              ball.applyForce(a);
            }
          }
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
            ball.applyForce(new Vector(0, gravityForce));
          }
          ball.updatePosition((canvas.deltaTime * speed) / 1000 / iterations);


          if (collisionsEnabled) {
            this.updateQuadTree();
            const {p: {x, y}, radius: r} = ball;
            const ballsToCheck = this.quadTree.query(new Circle(x, y, r + ballSize / 2));
            for (let i = 0; i < ballsToCheck.length - 1; i++) {
              const ball1 = this.balls[ballsToCheck[i].data.index];
              for (let j = i + 1; j < ballsToCheck.length; j++) {
                const ball2 = this.balls[ballsToCheck[j].data.index];
                const collisionResult = ball1.handleCollisionWith(ball2);
                if (collisionResult && drawCollisionEffect) {
                  collisions.push(collisionResult);
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
        for (const ball of this.balls) {
          ball.draw(canvas);
        }
      }


      if (drawCollisionEffect) {
        for (const value of collisions) {
          value.draw(canvas);
        }
      }
    };
  }

  ngOnDestroy() {
    if (this.p5Canvas) {
      this.p5Canvas.remove();
    }
  }

  private adjustCanvasSize(width, height) {
    if (this.p5Canvas) {
      this.p5Canvas.resizeCanvas(width, height);
    }
  }

  updateDataSource(): void {
    if (this.dataSource.length === this.balls.length) {
      this.dataSource = this.balls.map((ball, index) => ({x: (ball.p.x * 0.25 + this.dataSource[index].x * 0.75), y: ball.p.y * 0.25 + this.dataSource[index].y * 0.75, index}));
    } else {
      this.dataSource = this.balls.map((ball, index) => ({x: ball.p.x, y: ball.p.y, index}));
    }
  }

  private updateQuadTree() {
    const points = [];
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      points.push(new Point(ball.p.x, ball.p.y, {index: i}));
    }
    const {quadTreeBoxCapacity} = this.options;
    this.quadTree = new QuadTree(new Box(-1000000, -1000000, 2000000, 2000000), {capacity: quadTreeBoxCapacity}, points);
  }

  resetOptions() {
    this.persistForm.reset(createDefaultPhysicsBallOption());
  }
}

function shuffle<T>(list: Array<T>) {
  const result = [];
  const intermediate = [...list];
  while (intermediate.length > 0) {
    const randomIndex = Math.random() * intermediate.length - 1;
    result.push(...intermediate.splice(randomIndex));
  }
  return result;
}
