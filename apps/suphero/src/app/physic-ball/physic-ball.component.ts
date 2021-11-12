import {AfterContentInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {filterNil, filterNilValue} from '@datorama/akita';
import {UntilDestroy} from '@ngneat/until-destroy';
import {GravityWorldOptions} from '@supcode-mono/api-interfaces';
import * as P5 from 'p5';
import {interval, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {Ball} from './ball';
import {PhysicsBallQuery, PhysicsBallService} from './state';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'sup-hero-physic-ball',
  templateUrl: './physic-ball.component.html',
  styleUrls: ['./physic-ball.component.scss']
})
export class PhysicBallComponent implements AfterContentInit, OnDestroy {
  balls: Ball[] = [];
  dataSource: { x: number; y: number; index: number }[] = [];

  @ViewChild('physicsCanvas', {static: true}) canvasElemRef: ElementRef;
  debug: false;
  optionsForm: FormGroup;
  private updateDataSourceSub: Subscription;
  private p5Canvas: P5;

  constructor(private fb: FormBuilder, private physicsBallQuery: PhysicsBallQuery, private physicsBallService: PhysicsBallService) {
    this.initForm();
    this.physicsBallQuery.selectBalls().subscribe(value => this.balls = value);
    if (this.debug) {
      this.updateDataSourceSub = interval(200).subscribe(value => this.updateDataSource());
    }
  }

  private initForm() {
    this.physicsBallQuery.selectOptions().pipe(
      filterNilValue(),
      map(options => this.fb.group(options)),
      tap(form => this.optionsForm = form),
      switchMap(form => form.valueChanges),
      debounceTime(300),
      distinctUntilChanged(),
      tap((options: GravityWorldOptions) => this.physicsBallService.updateOptions(options))
      /*switchMap(form => form.valueChanges),
      tap(console.log)*/
    ).subscribe();
  }

  private get options(): GravityWorldOptions {
    return this.physicsBallQuery.getOptions();
  }

  ngAfterContentInit(): void {
    const options$ = this.physicsBallQuery.selectOptions();
    options$.pipe(
      filterNilValue(),
      distinctUntilChanged((
        {width: w1, height: h1}, {width: w2, height: h2}) =>
        w1 === w2 && h1 === h2
      )
    ).subscribe(
      ({width, height}) => {
        if (this.p5Canvas == null) {
          this.createCanvas();
        }
        this.adjustCanvasSize(width, height);
      });


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
    const size = Math.max(ballSize * Math.random(), 3);
    const {height, width, restitution} = this.options;
    const newBall = new Ball(Math.random() * width, Math.random() * height, size, restitution, Math.random() * 255, Math.random() * 255, Math.random() * 255);
    if (this.balls.every(value => !newBall.hasCollisionWith(value))) {
      this.balls.push(newBall);
    }
  }

  removeBall() {
    if (this.balls.length > 1) {
      const numberOfElementsToRemove = this.balls.length - this.options.ballsAmount;
      this.balls.splice(this.balls.length - numberOfElementsToRemove - 1, numberOfElementsToRemove);
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
      canvas.angleMode(canvas.RADIANS);
      // this.balls.push(new Sun(width / 2, height / 2));
    };

    canvas.draw = () => {
      const {ballsAmount, ballSize, gravityEnabled, drawTails, gravityForce, wallsEnabled, collisionsEnabled, ballsGravityEnabled, iterations, speed, drawCollisionEffect, gravityConstant, width, height} = this.options;
      canvas.background(20, 20, 20, drawTails ? 20 : 255);
      for (const ball of this.balls) {
        ball.draw(canvas);
        ball.updatePosition((canvas.deltaTime * speed) / 1000 / iterations);
      }
    };
  }

  ngOnDestroy() {
    if (this.p5Canvas) {
      this.p5Canvas.remove();
    }
    this.physicsBallService.disconnect();
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

  resetOptions() {
    this.initForm();
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
