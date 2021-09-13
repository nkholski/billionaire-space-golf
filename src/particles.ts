import { state, vector2 } from "./state";
import { height, width } from "./constants";
import { particleCtx, particleCanvas } from "./graphics";
import {
  UpdateVelocity,
  UpdatePosition,
  Vector2,
  GetCollisionPoint,
} from "./physics";

interface Particle {
  p: vector2;
  c: string;
  v: vector2;
}

const MaxParticles = 100; // 100 --> 101

let nextParticleIndex = 0;

const Particles: Particle[] = [];

export const createParticle = (p: vector2, c: string, v: vector2) => {
  let m = Vector2.Magnitude(v);
  let n = Vector2.Multiply(Vector2.N(v), m * 0.6);

  Particles[nextParticleIndex++] = {
    p: { ...p },
    c,
    v: { x: n.x * (1 + Math.random()), y: n.y * (1 + Math.random()) },
  };
  nextParticleIndex = nextParticleIndex > MaxParticles ? 0 : nextParticleIndex;
};

const pc = 0;

export const updateParticle = () => {
  requestAnimationFrame(updateParticle);
  if (pc % 2) {
    return;
  }

  particleCanvas.width = width;
  Particles.forEach((p, i) => {
    if (!p) {
      return;
    }

    p.p = UpdatePosition(p.p, p.v);

    if (
      !state.level ||
      state.level.planets.some((planet) =>
        GetCollisionPoint(p.p, 1, planet.position, planet.size, p.v)
      )
    ) {
      Particles[i] = null;
      return;
    }

    p.v = UpdateVelocity(p.p, p.v);

    particleCtx.fillStyle = "#" + p.c;
    particleCtx.fillRect(p.p.x, p.p.y, 3, 3);
  });
};
