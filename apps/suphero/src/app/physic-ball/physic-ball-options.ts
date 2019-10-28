export interface PhysicBallOptions {
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
}

export function createDefaultPhysicsBallOption(): PhysicBallOptions {
  return {
    ballsAmount: 15,
    ballSize: 30,
    gravityEnabled: true,
    gravityForce: 0.9,
    restitution: 0.9,
    wallsEnabled: true,
    collisionsEnabled: true,
    width: 640,
    height: 420,
    iterations: 10,
    speed: 10,
    drawCollisionEffect: true,
    quadTreeBoxCapacity: 4,
    ballsGravityEnabled: true,
    gravityConstant: 6.75
  };
}
