import {AfterContentInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UntilDestroy} from '@ngneat/until-destroy';
import * as P5 from 'p5';
import {concat, interval, of, Subscription} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {Vector} from 'vector2d';
import {Ball} from './ball';
import {Collision} from './collision';
import {QuadTree, Box, Point, Circle} from 'js-quadtree';

interface PhysicBallOptions {
  ballSize: number;
  ballsAmount: number;
  gravityEnabled: boolean;
  gravityForce: number;
  restitution: number;
  wallsEnabled: boolean;
  collisionsEnabled: boolean;
  width: number;
  height: number;
  iterations: number;
  speed: number;
  drawCollisionEffect: boolean,
  quadTreeBoxCapacity: number,
}

const defaultOptions: PhysicBallOptions = {
  ballsAmount: 10,
  ballSize: 50,
  gravityEnabled: true,
  gravityForce: 0.9,
  restitution: 0.9,
  wallsEnabled: true,
  collisionsEnabled: true,
  width: 480,
  height: 320,
  iterations: 10,
  speed: 10,
  drawCollisionEffect: true,
  quadTreeBoxCapacity: 4
};

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'sup-hero-physic-ball',
  templateUrl: './physic-ball.component.html',
  styleUrls: ['./physic-ball.component.scss']
})
export class PhysicBallComponent implements AfterContentInit, OnDestroy {
  balls: Ball[] = [];
  options: FormGroup;
  dataSource: { x: number; y: number; index: number }[] = [];
  quadTree: QuadTree;

  @ViewChild('physicsCanvas', {static: true}) canvasElemRef: ElementRef;
  private p5Canvas: P5;
  private updateDataSourceSub: Subscription;
  debug: false;

  constructor(fb: FormBuilder) {
    this.options = fb.group(defaultOptions);
    if (this.debug) {
      this.updateDataSourceSub = interval(200).subscribe(value => this.updateDataSource());
    }
    this.quadTree = new QuadTree();
  }

  ngAfterContentInit(): void {
    const options$ = concat(of(defaultOptions), this.options.valueChanges);
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
    const {height, width, restitution} = this.options.value as PhysicBallOptions;
    const newBall = new Ball(Math.random() * width, Math.random() * height, size, restitution, Math.random() * 255, Math.random() * 255, Math.random() * 255);
    if (this.balls.every(value => !newBall.hasCollisionWith(value))) {
      this.balls.push(newBall);
    }
  }

  removeBall() {
    if (this.balls.length > 1) {
      this.balls.shift();
    }
  }

  private createCanvas() {
    const myP5 = new P5(p5Canvas =>
      this.sketch(p5Canvas), this.canvasElemRef.nativeElement);
  }

  private sketch(canvas: P5) {

    this.p5Canvas = canvas;

    canvas.setup = () => {
      const {height, width} = this.options.value;
      this.quadTree = new QuadTree(new Box(0, 0, height, width));
      canvas.createCanvas(width, height);
    };

    canvas.draw = () => {
      const {ballsAmount, ballSize, gravityEnabled, gravityForce, wallsEnabled, collisionsEnabled, iterations, speed, drawCollisionEffect, width, height} = this.options.value as PhysicBallOptions;
      canvas.background(20, 20, 20, 20);
      this.adjustBallsLength(ballsAmount, ballSize);

      const collisions: Collision[] = [];
      for (let iter = 0; iter < iterations; iter++) {
        for (const ball of this.balls) {
            if (canvas.mouseIsPressed) {
              const mP = new Vector(canvas.mouseX, canvas.mouseY);
              const direction = ball.p.subtract(mP);
              const distance = mP.distance(ball.p);
              const rPow = distance * distance;

              if (rPow > 0) {
                const f = 6.7 * (500 + ball.mass) / Math.min(rPow, 1000);
                const a = direction.normalise().multiplyByScalar(-f);
                ball.applyForce(a);
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
                  if (collisionResult && drawCollisionEffect && iter + 1 === iterations) {
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
          const left = new Box(-wallSafetyArea, -wallSafetyArea, +wallSafetyArea +wallCollisionDistance, wallSafetyArea + heightMinusBallSize);
          const wallsToCheck = [down, left, up, right];

          for(const wall of wallsToCheck){
            const queryResult = this.quadTree.query(wall);
            for(const point of queryResult){
              this.balls[point.data.index].handleWallCollision(0,0,width, height);
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
    const {quadTreeBoxCapacity} = this.options.value as PhysicBallOptions;
    this.quadTree = new QuadTree(new Box(-1000000, -1000000, 2000000, 2000000), {capacity: quadTreeBoxCapacity}, points);
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
