import {Vector} from 'vector2d';

export interface Message {
  message: string;
}

export interface TimerMessage {
  time: Date;
}

export interface NextStepMessage {
  nextStep: { balls: GravityBall[] };
}

export interface GravityWorldOptionsMessage {
  options: GravityWorldOptions;
}


export interface GravityBall {
  diameter: number;
  r: any;
  g: any;
  b: any;
  _v: Vector;
  _p: Vector;
}

export interface GravityWorldOptions {
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
  ballsGravityEnabled: boolean,
  gravityConstant: number
  drawTails: boolean;
}
