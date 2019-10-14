import {Component, OnInit} from '@angular/core';
import * as p5 from 'p5';
import * as P5 from 'p5';


@Component({
  selector: 'sup-hero-physic-ball',
  templateUrl: './physic-ball.component.html',
  styleUrls: ['./physic-ball.component.scss']
})
export class PhysicBallComponent implements OnInit {
  private myP5: p5;


  constructor() {
  }

  ngOnInit(): void {
    this.createCanvas();
  }

  private createCanvas() {
    this.myP5 = new P5(this.sketch);
  }

  private sketch(canvas: p5) {
    const ballSize = 50;
    const balls: Ball[] = [];

    const amountBalls = 20;

    canvas.setup = () => {
      canvas.createCanvas(1200, 800);
      const y = canvas.height / 2;
      for (let i = 0; i < amountBalls; i++)
        balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height, ballSize * Math.random(), Math.random() * 0.8, Math.random() * 255, Math.random() * 255, Math.random() * 255));
    };


    canvas.draw = () => {
      canvas.background(20, 20, 20, 20);

      balls.forEach(ball => {

        if (canvas.mouseIsPressed) {
          let ax = canvas.mouseX - ball.x;
          let ay = canvas.mouseY - ball.y;

          const rPow = ax * ax + ay * ay;

          if (rPow > 0) {
            const f = 6.7 * (500 + ball.mass) / rPow;
            ax = Math.sign(ax) * f;
            ay = Math.sign(ay) * f;
            ball.push(ax, ay);
          }
        }

        // ball.applyForce(0, 0.9);

        // ball.handleCollision(0, 0, canvas.width, canvas.height);
        ball.updatePosition(canvas.deltaTime);
        ball.constrain(0, 0, canvas.width, canvas.height);
        ball.draw(canvas);
      });
    };

  }

}

class Ball {

  private ax = 0;
  private ay = 0;
  private vx = 0;
  private vy = 0;
  mass = 0;


  constructor(public x, public y, private size, private elasticity = 0.7, private r, private g, private b) {
    this.mass = size * Math.PI;
  }

  draw(canvas: p5) {
    canvas.fill(this.r, this.g, this.b);
    canvas.circle(this.x - this.size / 2, this.y - this.size / 2, this.size);
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
    this.push(x, y);
  }

  push(ax: number, ay: number) {
    this.ax = this.ax + ax;
    this.ay = this.ay + ay;
  }

  handleCollision(left: number, top: number, right: number, bottom: number) {
    if (this.x <= left && this.vx < 0) {
      this.vx = -this.vx * this.elasticity;
    }
    if (this.x >= right && this.vx > 0) {
      this.vx = -this.vx * this.elasticity;
    }
    if (this.y >= bottom && this.vy > 0) {
      this.vy = -this.vy * this.elasticity;
    }
    if (this.y <= top && this.vy < 0) {
      this.vy = -this.vy * this.elasticity;
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
