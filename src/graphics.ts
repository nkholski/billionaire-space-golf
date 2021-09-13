import { Clamp } from "./helpers";
import { getVelocityFromAnge } from "./index";
import {
  Vector2,
  UpdateVelocity,
  UpdatePosition,
  GetCollisionPoint,
  GetBounce,
} from "./physics";
import { vector2, Planet, GameState, state } from "./state";
import { textureCanvas } from "./texture";
import { height, portalSize, white, width } from "./constants";

export const screenCanvs = document.createElement("canvas");
export const screenCtx = screenCanvs.getContext("2d");

export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d");

export const liveCanvas = document.createElement("canvas");
export const liveCtx = liveCanvas.getContext("2d");

export const plotCanvas = document.createElement("canvas");
export const plotCtx = plotCanvas.getContext("2d");

export const plasmaCanvas = document.createElement("canvas");

export const plasmaCtx = plasmaCanvas.getContext("2d");

export const particleCanvas = document.createElement("canvas");
export const particleCtx = particleCanvas.getContext("2d");

screenCanvs.id = "game";
screenCanvs.width =
  canvas.width =
  liveCanvas.width =
  plasmaCanvas.width =
  particleCanvas.width =
  plotCanvas.width =
    width;
screenCanvs.height =
  canvas.height =
  liveCanvas.height =
  plasmaCanvas.height =
  particleCanvas.height =
  plotCanvas.height =
    height;
// canvas.onmousemove = updateMouse(canvas);
// const div = document.createElement("div");
// div.appendChild(screenCanvs);
document.body.appendChild(screenCanvs);

let plasmaTick = 0;
export const UpdatePlasma = () => {
  //https://www.dwitter.net/d/23496
  plasmaTick += 1;
  if (plasmaTick % 10 != 0) {
    return;
  }

  plasmaCanvas.width = 40;
  plasmaCanvas.height = 40;

  let div = 10; //15

  let c = plasmaCanvas;
  let x = plasmaCtx;
  let w = plasmaCanvas.width;
  let X = 0,
    Y = 0,
    t = plasmaTick / 99,
    m = 0;
  let i = plasmaCanvas.width * plasmaCanvas.height; // antal punkter

  let R = (r, g, b) => `rgb(${r / div},${g / div},${b / div})`;
  let S = Math.sin;
  let C = Math.cos;

  //@ts-ignore
  for (c.width = w; i--; ) {
    x.fillRect(X, Y, 1, 1);
    x.fillRect(X, Y, 1, 1);
    x.fillStyle = R(
      (m =
        i / 7 +
        S(t + (X = i % w) / 9) *
          C((Y = (i / w) | 0) / 9 + t * 4 - C(X / 9 + t)) *
          9 *
          5),
      m / (2 + C(t)),
      m * (2 + S(t) / 2)
    );
  }

  // liveCanvas.width = liveCanvas.width;
  // liveCtx.drawImage(plasmaCanvas,0,0,width,height);
};

let ignorePlotCollision = 0;
export const PlotCurve = (power: number) => {
  let p = state.position;
  let bounce = 0;
  let v = Vector2.Multiply(getVelocityFromAnge(power), 25);
  let v2 = Vector2.N(v);
  ignorePlotCollision = 0;
  ctx.lineWidth = 5;

  ctx.beginPath();

  var hue = ((1 - power / 650) * 120).toString(10);

  ctx.strokeStyle = ["hsl(", hue, ",100%,50%)"].join("");

  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + v2.x * power, p.y + v2.y * power);
  ctx.stroke();
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.strokeStyle = "yellow";
  ctx.setLineDash([5, 15]);
  ctx.moveTo(p.x, p.y);

  for (var i = 0; i < 150; i++) {
    v = UpdateVelocity(p, v);
    p = UpdatePosition(p, v);

    if (ignorePlotCollision-- < 0) {
      state.level.planets.forEach((planet) => {
        const col = GetCollisionPoint(p, 5, planet.position, planet.size, v);
        if (col) {
          ignorePlotCollision = 2;
          p = col;
          v = GetBounce(p, v, planet, false, false);
          bounce++;
        }
      });
    }
    ctx.lineTo(p.x, p.y);

    if (
      state.level.portals.some((portal) =>
        GetCollisionPoint(p, 5, portal, portalSize, v)
      ) ||
      bounce > 2
    ) {
      break;
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
  //@ts-ignore

  window.debug = false;
  ctx.strokeStyle = "black";
};

export const DrawFlag = () => {
  const a = state.level.flagAngle;

  // let {x,y} = planet.position;
  // x += planet.size*Math.cos(a);
  // y += planet.size*Math.sin(a);

  let { x, y } = state.level.flagPosition;
  ctx.save();

  ctx.translate(x, y);
  ctx.beginPath();

  ctx.fillStyle = "#000";

  ctx.rotate(a - Math.PI / 2);

  ctx.arc(0, -4, 5, 0, 2 * Math.PI, false);
  ctx.fill();

  ctx.beginPath();

  ctx.lineWidth = 5;

  ctx.strokeStyle = "#FFF";

  // ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.moveTo(0, 0);
  ctx.lineTo(0, 45);
  ctx.stroke();

  ctx.fillStyle = "#F55";

  ctx.beginPath();
  ctx.moveTo(0, 47);
  ctx.lineTo(20, 37);
  ctx.lineTo(0, 27);
  ctx.fill();
  ctx.restore();
  //ctx.lineTo(x+45*Math.cos(a), y+45*Math.sin(a));
};

export const DrawBall = () => {
  if (
    state.gameState != GameState.Aiming &&
    state.gameState != GameState.Waiting
  ) {
    return;
  }
  const { x, y } = state.position;
  ctx.beginPath();

  ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
  ctx.fillStyle = white;
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#888";
  ctx.stroke();

  if (state.gameState == GameState.Waiting) {
    plotCtx.beginPath();
    plotCtx.arc(x, y, 2, 0, 2 * Math.PI, false);
    plotCtx.fillStyle = "#FFF";
    plotCtx.fill();
    plotCtx.lineWidth = 1;
    plotCtx.strokeStyle = "#888";
    plotCtx.stroke();
  }
};

export const DrawPlanet = (planet: Planet, t: number) => {
  const { x, y } = planet.position;
  const size = planet.size; // - (3000/(t**1.5)) * Math.cos(t/10);

  var gradient = ctx.createRadialGradient(x, y, 0, x, y, size + 40);

  planet.type = Clamp(planet.type, 0, 3); // TODO: Rempove
  const halo = ["0,153,255", "255,255,143", "255,138,0", "255,255,255"][
    planet.type
  ];

  gradient.addColorStop(0, "rgba(" + halo + ",255)");
  //gradient.addColorStop(1, 'red');

  gradient.addColorStop(1, "rgba(" + halo + ",0)");

  ctx.beginPath();

  ctx.fillStyle = gradient;
  ctx.arc(x, y, size + 40, 0, 2 * Math.PI, false);
  ctx.fill();

  ctx.beginPath();

  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
  ctx.fillStyle = ctx.createPattern(textureCanvas[planet.type], "repeat");
  ctx.fill();

  var gradient = ctx.createRadialGradient(x, y, size / 4, x, y, size * 1.1);
  gradient.addColorStop(0, "rgba(" + halo + ",0)");
  //gradient.addColorStop(1, 'red');
  gradient.addColorStop(1, "rgba(" + halo + ",20)");

  ctx.fillStyle = gradient;
  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
  ctx.fill();
};

//const get255Value = (t: number) => (Math.abs(250*Math.sin(t/40)))

export const DrawPortals = (t: number) => {
  state.level.portals.forEach((p) => {
    const { x, y } = p;
    const size = portalSize + 5 * Math.cos(t / 20);

    var gradient = ctx.createRadialGradient(x, y, 0, x, y, size + 40);

    const halo = Math.abs(250 * Math.sin(t / 40)) + ",153,255";

    gradient.addColorStop(0, "rgba(" + halo + ",255)");
    //gradient.addColorStop(1, 'red');

    gradient.addColorStop(1, "rgba(" + halo + ",0)");

    ctx.beginPath();

    ctx.fillStyle = gradient;
    ctx.arc(x, y, size + 40, 0, 2 * Math.PI, false);
    ctx.fill();
  });
};

export const DrawVector2 = (origin: vector2, v: vector2) => {
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(origin.x + v.x, origin.y + v.y);
  ctx.stroke();
};
