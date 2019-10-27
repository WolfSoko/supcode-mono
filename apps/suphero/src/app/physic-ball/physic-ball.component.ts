import {AfterContentInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UntilDestroy} from '@ngneat/until-destroy';
import * as P5 from 'p5';
import {concat, of} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {Vector} from 'vector2d';
import {Ball} from './ball';

interface PhysicBallOptions {
  ballSize: number;
  ballsAmount: number;
  gravityEnabled: boolean;
  gravityForce: number;
  wallsEnabled: boolean;
  collisionsEnabled: boolean;
  width: number;
  height: number;
}

const defaultOptions: PhysicBallOptions = {
  ballsAmount: 10,
  ballSize: 50,
  gravityEnabled: true,
  gravityForce: 0.9,
  wallsEnabled: true,
  collisionsEnabled: true,
  width: 480,
  height: 320
};

async function sleep(timeout: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'sup-hero-physic-ball',
  templateUrl: './physic-ball.component.html',
  styleUrls: ['./physic-ball.component.scss']
})
export class PhysicBallComponent implements AfterContentInit, OnDestroy {
  balls: Ball[] = [];
  options: FormGroup;

  @ViewChild('physicsCanvas', {static: true}) canvasElemRef: ElementRef;
  private p5Canvas: P5;

  constructor(fb: FormBuilder) {
    this.options = fb.group(defaultOptions);
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

  async addBall(ballSize) {
    const size = ballSize * Math.random();
    const {height, width} = this.options.value;
    this.balls.push(new Ball(Math.random() * width, Math.random() * height, size, Math.random() * 0.8, Math.random() * 255, Math.random() * 255, Math.random() * 255));
  }

  removeBall() {
    if (this.balls.length > 1) {
      this.balls.shift();
    }
  }

  private createCanvas() {
    new P5(p5Canvas =>
      this.sketch(p5Canvas), this.canvasElemRef.nativeElement);
  }

  private sketch(canvas: P5) {

    this.p5Canvas = canvas;

    canvas.setup = () => {
      const {height, width} = this.options.value;
      canvas.createCanvas(width, height);
      const y = canvas.height / 2;
    };

    canvas.draw = () => {
      const {ballsAmount, ballSize, gravityEnabled, gravityForce, wallsEnabled, collisionsEnabled} = this.options.value as PhysicBallOptions;
      canvas.background(20, 20, 20, 20);
      this.adjustBallsLength(ballsAmount, ballSize);

      this.balls.forEach(ball => {
          if (canvas.mouseIsPressed) {
            const mP = new Vector(canvas.mouseX, canvas.mouseY);
            const direction = ball.getP().subtract(mP);
            const distance = mP.distance(ball.p);
            const rPow = distance * distance;
            if (rPow > 0) {
              const f = 6.7 * (500 + ball.mass) / rPow;
              const a = direction.normalise().multiplyByScalar(-f);
              ball.applyForce(a);
            }
          }

          if (gravityEnabled) {
            ball.applyForce(new Vector(0, gravityForce));
          }

          if (collisionsEnabled) {
            for (let i = 0; i < this.balls.length - 1; i++) {
              for (let j = i + 1; j < this.balls.length; j++) {
                this.balls[i].checkCollision(this.balls[j]);
              }
            }
          }
          if (wallsEnabled) {
            ball.handleCollision(0, 0, canvas.width, canvas.height);
          }
          ball.updatePosition(canvas.deltaTime);
          ball.draw(canvas);
        }
      );
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
}
