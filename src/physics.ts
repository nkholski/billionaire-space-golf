import { createParticle } from "./particles";
import { audioCool, PlaySound, SoundEffect } from "./audio";
import { height, width } from "./constants";
import { AddText } from "./text";
import {
  GameState,
  LoadLevel,
  Planet,
  PlanetType,
  state,
  vector2,
} from "./state";

const G = 3; // 6.674e-11;
const ballWeight = 1;
const bouncePower = 0.75;
export class Vector2 {
  x = 0;
  y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static _Add = (v1: vector2, v2: vector2, m = 1) => ({
    x: v1.x + m * v2.x,
    y: v1.y + m * v2.y,
  });

  static Add = (v1: vector2, v2: vector2) => Vector2._Add(v1, v2);
  static Sub = (v1: vector2, v2: vector2) => Vector2._Add(v1, v2, -1);

  static Multiply = (v1: vector2, v: number) => ({
    x: v1.x * v,
    y: v1.y * v,
  });

  static Dot = (v1: vector2, v2: vector2) => v1.x * v2.x + v1.y * v2.y; // https://www.mathsisfun.com/algebra/vectors-dot-product.html

  static Det = (v1: vector2, v2: vector2) => v1.x * v2.y + v1.y * v2.x;

  static angle = (v1: vector2) =>
    Math.atan2(
      Vector2.Det(v1, { x: 0, y: 1 }),
      Vector2.Dot(v1, { x: 0, y: 1 })
    );

  static N = (v: vector2) =>
    Vector2.Multiply(v, 1 / Math.sqrt(v.x * v.x + v.y * v.y));

  static Magnitude = (v: vector2) => Math.sqrt(v.x * v.x + v.y * v.y);
}

// const GetAttractionForce = (mass: number, distance: number) => (G * mass * ballWeight)/(distance*distance);
const GetAttractionForce = (mass: number, distance: number) =>
  (G * mass * ballWeight) / Math.pow(distance, 1.4);

export const GetForce = (p: vector2) => {
  const forces = state.level.planets.map((body) => {
    const difference = Vector2.Sub(body.position, p);
    const distance = Math.sqrt(
      difference.x * difference.x + difference.y * difference.y
    );
    const direction = Vector2.Multiply(difference, 1 / distance);
    const f =
      GetAttractionForce(body.size * 1000, distance) *
      (body.type == PlanetType.Negative ? -1 : 1);
    return Vector2.Multiply(direction, f);
  });

  return forces.reduce((a, f) => Vector2.Add(a, f), { x: 0, y: 0 });
};

export const UpdateVelocity = (p: vector2, v: vector2) =>
  Vector2.Add(v, GetForce(p));

export const UpdatePosition = (p: vector2, v: vector2) =>
  Vector2.Add(p, Vector2.Multiply(v, 0.001));

// export const GetCircleTangent = (point: vector2, planet: planet) => {
//     const a = Vector2.Add(point,planet.position,-1);
//     return {x:a.y,y:-a.x};
// }

export const GetCollisionPoint = (
  p1: vector2,
  s1: number,
  p2: vector2,
  s2: number,
  v: vector2 // Nytt
) => {
  let surfacePoint: vector2 = null;
  const steps = 100;
  let stepsDone = 0;
  let collided = false;

  const V = Vector2.N(v); // state.velocity

  while (stepsDone == 0 || collided) {
    surfacePoint = Vector2.Sub(p1, Vector2.Multiply(V, stepsDone / steps));

    const difference = Vector2.Sub(surfacePoint, p2);
    const distance = Math.sqrt(
      difference.x * difference.x + difference.y * difference.y
    );

    collided = distance < s1 + s2;
    stepsDone++;
  }
  //stepsDone > 1 && console.log(surfacePoint);
  return stepsDone > 1 ? surfacePoint : null;
};

export const GetSurfaceAngle = () => {
  const a =
    57 *
      Vector2.angle(Vector2.Sub(state.currentPlanet.position, state.position)) +
    90;

  return a > 360 ? a + 360 : a < 0 ? a - 360 : a;

  // const difference = Vector2.Sub(state.currentPlanet.position,state.position);
  // return Math.atan(difference.x/difference.y)+  Math.PI/2;
};

export const GetBounce = (
  point: vector2,
  velocity: vector2,
  planet: Planet,
  particles: boolean,
  real = true
) => {
  //https://stackoverflow.com/questions/61272597/calculate-the-bouncing-angle-for-a-ball-point

  if (audioCool.bounce < 0) {
    real &&
      PlaySound(
        planet.type == PlanetType.Sand
          ? SoundEffect.Bunker
          : planet.type == PlanetType.Sun
          ? SoundEffect.Lava
          : SoundEffect.Bounce
      );
  }
  audioCool.bounce = 10;

  const suraceNormalUnitVector = Vector2.N(Vector2.Sub(point, planet.position));
  // return Vector2.Multiply(suraceNormalUnitVector,100);
  const tmp = Vector2.Multiply(
    suraceNormalUnitVector,
    -2 * Vector2.Dot(suraceNormalUnitVector, velocity) * bouncePower
  );

  const collisionV = Vector2.Add(tmp, velocity);

  if (real && particles) {
    for (let i = 0; i < 20; i++) {
      createParticle(
        point,
        ["99F", "DD0", "F00", "FFF"][planet.type],
        collisionV
      );
    }
  }

  if (real && planet.type == PlanetType.Sun) {
    AddText(-1, -1, "Melted ball", 10, 100);
    killed();
  }

  if (planet.type == PlanetType.Sand || planet.type == PlanetType.Sun) {
    return { x: 0, y: 0 };
  }

  return collisionV;
  //return 1;
};

export const killed = () => {
  state.gameState = GameState.Dead;
  setTimeout(() => {
    state.position = { ...state.lastStable };
    state.gameState = GameState.Aiming;
    PlaySound(SoundEffect.Resurrect);
  }, 1000);
};
