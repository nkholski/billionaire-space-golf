import { GameState, state } from "./state";
import { canvas, screenCtx, plasmaCanvas } from "./graphics";
import { Clamp } from "./helpers";
import { height, width } from "./constants";

export const StarSky: HTMLCanvasElement = document.createElement("canvas");

const starSkies: HTMLCanvasElement[] = [];
const alphaIndex: number[] = [];
StarSky.width = width;
StarSky.height = height;

export const initStars = () => {
  for (let i = 0; i < 5; i++) {
    starSkies[i] = document.createElement("canvas");
    starSkies[i].width = width;
    starSkies[i].height = height;
    alphaIndex[i] = 90 * Math.random();
    const ctx = starSkies[i].getContext("2d");

    for (let s = 0; s < 100; s++) {
      let size = 1 + 3 * Math.random();
      let x = width * Math.random();
      let y = height * Math.random();
      let fillStyle = "";
      for (let c = 0; c < 3; c++) {
        fillStyle += `${156 + 99 * Math.random()},`;
      }

      ctx.fillStyle = `rgba(${fillStyle}255)`;
      ctx.fillRect(x, y, size, size);
    }
  }
};

let t = 0;
let isMoving = true;
let speed = 0;
let targetSpeed = 0;

export enum StarMovement {
  Stable,
  WarpUp,
  WarpDown,
}

let acc = 0;

export const setSpeed = (s: number) => (speed = s);

export const setTargetSpeed = (s: number) => {
  targetSpeed = s;
  state.travelState =
    speed < targetSpeed ? StarMovement.WarpUp : StarMovement.WarpDown;
  acc = targetSpeed > 0 ? 0.1 : -0.1;
  showScreen = targetSpeed > 0;
  isMoving = true;
  screenXStartPos = CalcXRaw(5);
};

export const starsIsDone = () =>
  state.travelState == StarMovement.WarpUp
    ? speed >= targetSpeed
    : speed <= targetSpeed;

let screenX = 0;
let screenXStartPos = 0;

let baseXPos = 0;

let showScreen = true;

export const getScreenLayerPosition = () => screenX;
const CalcXRaw = (i) => -baseXPos * i;

export const updateStarsCanvas = () => {
  //console.log(speed ** 2 - 2 * acc * (width / 5));
  if (acc != 0 && state.travelState == StarMovement.WarpDown && !showScreen) {
    //
    const xxxx = -speed / acc;

    if (0.5 * acc * xxxx ** 2 + speed * xxxx <= width / 5) {
      state.gameState =
        state.travelDestination != null
          ? state.travelDestination
          : state.gameState;
      state.travelDestination = null;

      screenXStartPos = -(width - CalcXRaw(5) - 49.5); // Where did 49.5 come from? :-)

      showScreen = true;
    }

    if (
      Math.sqrt(speed ** 2 - (2 * acc * width) / 5) - (acc - 1) * speed <= 0 &&
      !showScreen
    ) {
      showScreen = true;
      screenXStartPos = 2 * width + CalcXRaw(5);
      //      alert("NU!");
    }
  }

  if (targetSpeed == 0 && Math.abs(speed) < 0.2) {
    speed = 0;
    isMoving = false;
    state.travelState = StarMovement.Stable;
  } else if (state.travelState != StarMovement.Stable) {
    if ((acc > 0 && targetSpeed > speed) || (acc < 0 && targetSpeed < speed)) {
      speed += acc;
    } else {
      screenXStartPos = width;

      state.travelState = StarMovement.Stable;
      state.gameState = GameState.TransitionText;
      acc = 0;
      speed = targetSpeed;
    }
    //   ( state.travelState  == StarMovement.WarpUp
    //     ? speed < targetSpeed && 1.05
    //     : speed > targetSpeed && 0.95) || 1;
    // t++;
  }
  // if(speed>0.001) {
  //     speed*=0.95;
  //     t++;

  // }
  // else {
  //     isMoving = false;

  // }
  //    speed = 2;

  StarSky.width = width;

  isMoving
    ? requestAnimationFrame(updateStarsCanvas)
    : setTimeout(() => requestAnimationFrame(updateStarsCanvas), 100);
  const ctx = StarSky.getContext("2d");
  ctx.drawImage(plasmaCanvas, 0, 0, width, height);

  baseXPos += speed;

  screenX = CalcXRaw(5) - screenXStartPos;

  if (screenX < 0 && state.travelState != StarMovement.WarpUp) {
    screenX = 0;
  }

  if (
    screenX < -width &&
    showScreen &&
    state.travelState != StarMovement.WarpDown
  ) {
    showScreen = false;
    canvas.width = width;
  }

  if (!showScreen) {
    screenX = width;
  }

  for (let i = 0; i < 5; i++) {
    let X = CalcXRaw(i);
    X = X - width * Math.floor(X / width);
    alphaIndex[i] += isMoving ? 0.05 : 0.2;
    (i < 3 &&
      (!isMoving || speed < 7) &&
      (ctx.globalAlpha = (1.5 + Math.sin(alphaIndex[i])) / 2.5)) ||
      (ctx.globalAlpha = 1 / (5 - i));

    ctx.drawImage(starSkies[i], X, 0);
    ctx.drawImage(starSkies[i], X - width, 0);
    ctx.globalAlpha = 1;
  }
  if (isMoving && speed > 12) {
    for (let i = 0, r = Clamp((speed * Math.random()) / 3, 0, 20); i < r; i++) {
      ctx.beginPath();
      let X = width * Math.random() * 1.2 - 200;
      let Y = height * Math.random();
      ctx.strokeStyle = "white";
      ctx.moveTo(X, Y);
      ctx.lineTo(X + 300 + 200 * Math.random(), Y);
      ctx.stroke();
    }
  }
};

initStars();
requestAnimationFrame(updateStarsCanvas);
