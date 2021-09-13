import { sendGame, GlobalGames } from "./decentralization";
import { openFullscreen } from "./scaletofit";
import { UpdateStatsPage } from "./statspage";
import { LevelStat, Persistant, UpdatePersistant } from "./localStorage";
import { resetTouch, startListenders, touchState } from "./touch";
import { Clamp } from "./helpers";
import { updateTitleScreen } from "./titlescreen";
import { hudCanvas } from "./hud";
import { createParticle, updateParticle } from "./particles";
import {
  StarSky,
  setTargetSpeed,
  getScreenLayerPosition,
  starsIsDone,
  StarMovement,
} from "./stars";
import { height, width, MaxPower, portalSize, maxDrag } from "./constants";
import { CreateTextures, textureCanvas } from "./texture";
import {
  GetBounce,
  GetCollisionPoint,
  UpdateVelocity,
  Vector2,
  UpdatePosition,
  GetSurfaceAngle,
  killed,
} from "./physics";
import {
  state,
  GameState,
  LoadLevel,
  StateFromQuery,
  Input,
  PlanetType,
} from "./state";
import {
  ctx,
  canvas,
  DrawBall,
  DrawFlag,
  DrawPlanet,
  PlotCurve,
  UpdatePlasma,
  particleCanvas,
  plotCanvas,
  DrawPortals,
  screenCanvs,
  screenCtx,
} from "./graphics";
import { UpdateTexts, txtCanvas, AddText, txtCtx } from "./text";
import { audioCool, PlaySound, SoundEffect } from "./audio";

StateFromQuery();
startListenders();

let distanceTravelled = 0;
let totalDistanceTravelled = 0;

const basePower = 400;
let power = basePower;
let angle, surfaceAngle;
let fast = true;

export const getVelocityFromAnge = (power: number) => ({
  x: power * Math.sin((angle + 90) / 57),
  y: power * Math.cos((angle + 90) / 57),
});

let aimSpeed = 0;
let wasAiming = false;

let tickCnt = 0;

// const inputState: InputState = {
// 	left: false,
// 	right: false,
// 	up: false,
// 	down: false,
// 	space: false
// };

let lowsInARow = 0;

const Aim = (d: number) => {
  wasAiming = true;
  aimSpeed = Clamp(aimSpeed + 0.01, 0, 1);
  if (angle == undefined) {
    surfaceAngle = angle = GetSurfaceAngle();
  }
  angle += d * aimSpeed;
};

const Power = (d: number) => {
  wasAiming = true;
  aimSpeed = Clamp(aimSpeed + 0.01, 0, 1);
  power += d * 10 * aimSpeed;
  power =
    power < MaxPower / 20 ? MaxPower / 20 : power > MaxPower ? MaxPower : power;
};

// createFont();
fast && updateParticle();

const ResetGame = () => {};

let inPortal = false;
let t = 0;

const updateGameScreen = () => {
  // ctx.clearRect(0, 0, width, height);
  //  ctx.drawImage(liveCanvas,0,0);
  // ctx.drawImage(StarSky,0,0);

  ctx.save();
  ctx.scale(1, 1);
  ctx.drawImage(plotCanvas, 0, 0);
  ctx.drawImage(txtCanvas, 0, 0);
  //s	ctx.setTransform(1, 0, 0, 1, 0, 0);
  //scale += scale < 1 ? 0.01 : 0;
  //ctx.scale(scale, scale);

  state.level.planets.forEach((p) => {
    // ctx.drawImage(image, p.position.x, p.position.y, p.size, p.size);
    DrawPlanet(p, t);
    // DrawBall(p.position, p.size, "green");
  });

  DrawFlag();
  DrawBall();
  DrawPortals(t);

  ctx.drawImage(particleCanvas, 0, 0);

  if (state.gameState == GameState.Aiming) {
    PlotCurve(power);
    // DrawPower(power / MaxPower, angle);
  }
  ctx.restore();

  // if (state.frame % 30 == 0) {
  // ctx.font = "24px Arial";
  // [
  //   `Strikes: ${state.hits[state.level.index]} (Par: ${
  //     state.level.par
  //   }) FPS: ${fps}`,
  //   `Distance travelled: ${(
  //     (totalDistanceTravelled + distanceTravelled) /
  //     0.5e5
  //   ).toFixed(2)}M km`,
  //   `Last shot: ${(distanceTravelled / 0.5e5).toFixed(2)}M km`,
  // ].forEach((t, i) => {
  //   ctx.fillText(t, 10, 90 + i * 30); //[250, 700, 1300][i]
  // });
  // // }

  ctx.drawImage(hudCanvas, 0, 0);
};

let transitionStep = 0;
let prevNow = 0;
let accTime = 0;
let outOfBounds = 0;
let persistantLevel: LevelStat;
let autoplayTickDelay = 60;

let wasRotated = false;

let lastCalledTime = performance.now() - 1;
let fps = 0;

let slowTicks = 0;

function tick() {
  requestAnimationFrame(tick);

  tickCnt++;

  if (window.innerHeight > window.innerWidth) {
    AddText(-1, -1, "Rotate device", 20);
    txtCtx.fillStyle = "rgb(0,0,0,0.5)";
    txtCtx.fillRect(0, 0, width, height);
    UpdateTexts();
    wasRotated = true;
    // ctx.drawImage(txtCanvas, 0, 0);
    // screenCtx.drawImage(canvas, 0, 0);
    screenCtx.drawImage(txtCanvas, 0, 0);
    return;
  } else if (wasRotated) {
    wasRotated = false;
    AddText();
  }

  const delta = (performance.now() - lastCalledTime) / 1000;
  lastCalledTime = performance.now();
  fps = 1 / delta;

  // Prevent higher update frequency than 60hz (16.7ms/frame, 15 below to be "safe" ;-P)
  let newNow = performance.now();
  accTime += newNow - prevNow;
  prevNow = newNow;
  if (accTime < 13) {
    return;
  }
  accTime = 0;

  if (
    fast &&
    state.gameState == GameState.Aiming &&
    tickCnt > 300 &&
    fps < 45
  ) {
    if (slowTicks++ > 10) {
      fast = false;
    }
  } else {
    slowTicks = 0;
  }

  // Not to fast ensured, continue:
  fast && UpdatePlasma();

  state.gameState != GameState.TransitionText && state.level
    ? UpdateTexts(distanceTravelled, totalDistanceTravelled, fast)
    : UpdateTexts();
  state.frame++;
  persistantLevel = state.level && Persistant.levels[state.level.index];
  transitionStep =
    state.gameState == GameState.TransitionText ? transitionStep : 0;

  // state.gameState = GameState.Stats;

  canvas.width = width;

  state.click = null;
  if (touchState.execute) {
    if (touchState.magnitude < 9) {
      state.click = touchState.execute;
    }
    resetTouch();
  }

  t++;
  audioCool.bounce--;

  //     while( accTime > 33 ) {
  // 		looped++;
  //         accTime -= 30;
  // 		UpdatePlasma();
  // 		if(state.gameState == GameState.Waiting){

  // 		state.velocity = UpdateVelocity(state.position,state.velocity);
  // 		state.position = UpdatePosition(state.position, state.velocity);
  // 		}

  //     }
  // console.log(looped);

  screenCanvs.width = width;
  let screenOffset = 0;

  if (state.travelState != StarMovement.Stable) {
    state.input = null;
    touchState.startPos = null;
  }
  screenOffset = getScreenLayerPosition();

  screenCtx.drawImage(StarSky, 0, 0);

  // player.x = clamp(player.x, 0, canvas.width - 16);
  // player.y = clamp(player.y, 0, canvas.height - 16);

  lowsInARow = state.disabledCollider-- > -3 ? lowsInARow + 1 : 0;

  if (
    distanceTravelled > 0 &&
    state.gameState !== GameState.Waiting &&
    state.gameState !== GameState.IDLE
  ) {
    // distanceTravelled = 0;
    // totalDistanceTravelled += distanceTravelled;
  }

  switch (state.gameState) {
    case GameState.Dead:
      checkLongestShot();
      updateGameScreen();
      break;
    case GameState.TransitionText:
      screenOffset = 0;
      tickCnt = 0;
      if (transitionStep == 0) {
        totalDistanceTravelled = 0;
        distanceTravelled = 0;
        AddText();
        let l = 0;
        if (state.singleLevel > -1) {
          if (state.singleLevel == state.level?.index) {
            state.travelDestination = GameState.TitleScreen;
            transitionStep = 1;
            setTargetSpeed(0);
            return;
          } else {
            l = state.singleLevel;
          }
        } else if (state.level == undefined) {
          l = 0;
        } else {
          l = state.level.index + 1;
        }
        if (l > 8) {
          Persistant.times++;
          const hits = state.hits.reduce((a, b) => a + b, 0);
          Persistant.best =
            hits < Persistant.best || Persistant.best == 0
              ? hits
              : Persistant.best;
          UpdatePersistant();
          state.travelDestination = GameState.GameEnd;
          transitionStep = 1;
          setTargetSpeed(0);
          return;
        }

        persistantLevel = Persistant.levels[l];
        persistantLevel.times++;
        UpdatePersistant();
        LoadLevel(l);

        AddText(
          -1,
          height / 3 - 170,
          state.singleLevel == -1 ? `World: ${l + 1} of 9` : "Practise trip"
        );
        AddText(-1, height / 3, state.level.name, 25);
        //   AddText(-1, height / 3 + 70, `Hole: ${state.level.index + 1} of 9`, 12);
        AddText(-1, height / 3 + 130, `Par: ${state.level.par}`, 12);
        AddText(
          -1,
          height / 3 + 220,
          `Best: ${
            persistantLevel.best?.length > 0 ? persistantLevel.best.length : "-"
          }`,
          12
        );
        AddText(-1, height / 3 + 310, `Click / Press Space / Touch`, 5);
        AddText(
          -1,
          height / 3 + 610,
          `Don't forget to share your best recorded strikes (Check stats page)`,
          5
        );

        angle = surfaceAngle = GetSurfaceAngle();
        power = MaxPower * 0.7;
        transitionStep = 1;
        state.input = null;
      }

      if (
        state.travelDestination == GameState.TransitionText &&
        (state.input == Input.space || state.click)
      ) {
        AddText();
        setTargetSpeed(0);
        state.travelDestination = GameState.Aiming;
        state.input = null;
        //
        // surfaceAngle = angle = GetSurfaceAngle();
        // state.gameState = GameState.Aiming;
      }
      // else if (starsIsDone() && transitionStep == 2) {
      //   debugger;
      //   state.gameState = GameState.Aiming;
      //   transitionStep = 0;
      // } else {
      //   console.log(transitionStep);
      // }

      break;
    case GameState.NEAR:
      UpdateStatsPage(2);
      break;
    case GameState.TitleScreen:
      updateTitleScreen();
      break;
    case GameState.GameEnd:
      UpdateStatsPage();
      break;

    case GameState.Stats:
      UpdateStatsPage(1);
      break;
    case GameState.Waiting:
      updateGameScreen();

      state.velocity = UpdateVelocity(state.position, state.velocity);
      distanceTravelled += Vector2.Magnitude(state.velocity);
      state.position = UpdatePosition(state.position, state.velocity);

      outOfBounds =
        state.position.x < 0 ||
        state.position.x > width ||
        state.position.y < 0 ||
        state.position.y > height
          ? outOfBounds + 1
          : 0;

      if (outOfBounds > 250) {
        AddText(-1, -1, "Lost in space", 10, 100);
        PlaySound(SoundEffect.OB);
        killed();
      }

      lowsInARow = state.disabledCollider > -3 ? lowsInARow + 1 : 0;

      if (lowsInARow > 20) {
        checkLongestShot();
        state.disabledCollider = -1e9;
        state.gameState = GameState.Aiming;
        if (state.currentPlanet.type == PlanetType.Sand) {
          AddText(-1, -1, "Bunker planet", 10, 100);
        }
        power = basePower;
        angle = surfaceAngle = GetSurfaceAngle(); // samkör med flag angle
      } else if (state.disabledCollider-- < 0) {
        let collision = false;
        state.level.planets.forEach((planet) => {
          if (collision) {
            return;
          }
          const colPoint = GetCollisionPoint(
            state.position,
            5,
            planet.position,
            planet.size,
            state.velocity
          );

          state.currentPlanet = planet;

          if (!colPoint) {
            return;
          }
          if (planet == state.level.planets[1]) {
            const dist = Vector2.Magnitude(
              Vector2.Sub(colPoint, state.level.flagPosition)
            );
            if (dist < 14) {
              EndHole();
            }
          }
          collision = true;
          state.disabledCollider = 1;
          state.position = colPoint;
          state.velocity = GetBounce(
            colPoint,
            state.velocity,
            planet,
            lowsInARow < 3
          );
        });

        let portal = state.level.portals.find((p) =>
          GetCollisionPoint(state.position, 5, p, portalSize, state.velocity)
        );
        if (!inPortal && portal) {
          let i = state.level.portals.indexOf(portal);
          state.position = state.level.portals[i + (i % 2 == 0 ? 1 : -1)];
          state.gameState = GameState.IDLE;
          PlaySound(SoundEffect.Portal);
          setTimeout(() => {
            state.gameState = GameState.Waiting;
            PlaySound(SoundEffect.Portal);
          }, 1000);
        }
        inPortal = !!portal;
      }
      break;
    case GameState.Aiming: {
      if (!power) {
        power = MaxPower / 2;
      }
      if (!angle && angle !== 0) {
        angle = surfaceAngle = GetSurfaceAngle();
      }
      const minPower = Clamp(
        50 + state.currentPlanet.size * 1.2,
        0,
        MaxPower / 2
      );

      if (touchState.magnitude && !state.click) {
        // screenCtx.strokeStyle = "white";
        // screenCtx.beginPath();
        // screenCtx.moveTo(touchState.startPos.x, touchState.startPos.y);
        // screenCtx.lineTo(touchState.currentPos.x, touchState.currentPos.y);
        // screenCtx.stroke();
        power =
          minPower +
          MaxPower * (Clamp(touchState.magnitude, 0, maxDrag) / maxDrag);
        angle = 57 * Vector2.angle(touchState.vector) - 90;
        angle =
          angle > 360 ? (angle -= 360) : angle < 0 ? (angle += 360) : angle;
      }

      //

      // const size = 85;
      // angle =
      //   Clamp(angle + 85 * 2, surfaceAngle + 85, surfaceAngle + 85 * 3) -
      //   size * 2;

      // const make360 = (d) => (d > 360 ? d - 360 : d < 0 ? d + 360 : d);
      // const angleDistance = (a, b) => {
      //   const d = make360(make360(make360(make360(a)) - make360(make360(b))));
      // };
      // const minA = surfaceAngle - 85;
      // const maxA = surfaceAngle + 85;

      // if (
      //   angle !=
      //   Clamp(angle + 85 * 2, surfaceAngle + 85, surfaceAngle + 85 * 3) -
      //     size * 2
      // ) {
      //   angle =
      //     angleDistance(angle, minA) < angleDistance(angle, maxA) ? minA : maxA;
      // }

      power = Clamp(power, minPower, MaxPower);

      updateGameScreen();

      if (touchState.wasTouched && !touchState.startPos) {
        ctx.beginPath();
        ctx.font = "30px Arial";
        ctx.lineWidth = 5;
        ctx.fillStyle = ctx.strokeStyle = `rgba(255,255,255,${
          state.level.index == 0 ? 0.7 : 0.1
        } )`;
        ctx.rect(width / 4, height / 4, width / 2, height / 2);
        [
          "1. Aim with arrow keys or drag inside the square with touch/mouse.",
          "2. Tap, click or press space to shoot.",
        ].forEach((t, i) => {
          ctx.fillText(t, width / 4 + 40, height / 2 - 20 + i * 40);
        });

        ctx.stroke();
      }

      if (state.hits[state.level.index] == 6) {
        state.hits[state.level.index]++;
        EndHole();
      }

      state.lastStable = { ...state.position };

      if (state.autoPlay) {
        if (state.strikes.length == state.hits[state.level.index]) {
          state.autoPlay = false;
          return;
        }
        //@ts-ignore
        const [a, p] = state.strikes[state.hits[state.level.index]].split(",");
        power = parseFloat(p);
        angle = parseFloat(a);
      }

      switch (state.input) {
        case Input.left:
          Aim(1);
          break;
        case Input.right:
          Aim(-1);
          break;
        case Input.up:
          Power(1);
          break;
        case Input.down:
          Power(-1);
          break;
      }
      if (!wasAiming) {
        aimSpeed = 0;
      }
      wasAiming = false;

      if (
        state.input == Input.space ||
        state.click ||
        (state.autoPlay && autoplayTickDelay-- < 0)
      ) {
        autoplayTickDelay = 60;
        state.input = null;
        totalDistanceTravelled += distanceTravelled;

        distanceTravelled = 0;
        state.velocity = Vector2.Multiply(getVelocityFromAnge(power), 25);

        if (!state.autoPlay) {
          state.strikes.push("" + angle + "," + power);
          // navigator.clipboard.writeText(state.strikes.join(";"));
        }

        state.gameState = GameState.Waiting;
        plotCanvas.width = width;
        PlaySound(SoundEffect.Strike);
        state.hits[state.level.index]++;
      }

      break;
    }
    default: {
      updateGameScreen();
    }
  }

  ctx.drawImage(txtCanvas, 0, 0);
  screenCtx.drawImage(canvas, screenOffset, 0);

  if (state.input == Input.space || state.click) {
    state.input = null;
    resetTouch();
  }
  // DrawVector2(state.position, GetForce());
  // DrawVector2(state.position, state.velocity);

  // DrawToMouse();
  // console.log(state.velocity);
  // setBallState({x:0,y:0},t);
}

requestAnimationFrame(tick);
CreateTextures();

// window.addEventListener("keydown", (e: KeyboardEvent) => {
// 	switch (e.key) {
// 		case "ArrowLeft":
// 			inputState.left = true;
// 			break;
// 		case "ArrowRight":
// 			inputState.right = true;
// 			break;
// 		case "ArrowUp":
// 			inputState.up = true;
// 			break;
// 		case "ArrowDown":
// 			inputState.down = true;
// 			break;
// 		case " ":
// 			inputState.space = true;
// 	}
// });

// window.addEventListener("keyup", (e: KeyboardEvent) => {
// 	switch (e.key) {
// 		case "ArrowLeft":
// 			inputState.left = false;
// 			break;
// 		case "ArrowRight":
// 			inputState.right = false;
// 			break;
// 		case "ArrowUp":
// 			inputState.up = false;
// 			break;
// 		case "ArrowDown":
// 			inputState.down = false;
// 			break;

// 			case " ":
// 				inputState.space = false;
// 				break;
// 	}
// });

// export interface InputState {
// 	left: boolean;
// 	right: boolean;
// 	up: boolean;
// 	down: boolean;
// 	space: boolean;
// }

const EndHole = () => {
  state.gameState = GameState.Won;
  checkLongestShot(false);

  const h = state.hits[state.level.index];
  const p = state.level.par;
  let text = "";
  let result = "";

  h > p ? PlaySound(SoundEffect.Disaster) : PlaySound(SoundEffect.Win);

  if (state.autoPlay) {
    setTimeout(() => {
      setTargetSpeed(15);
      state.travelDestination = GameState.TitleScreen;
    }, 3e3);
    return;
  }
  if (h == 1) {
    text = "AMAZING!";
    result = "Hole in One";
  } else if (h < p) {
    text = "Great!";
    result = `${p - h} under par.`;
  } else if (h == p) {
    text = "Good Job!";
    result = "You got par.";
  } else if (h == 7) {
    text = "Disaster";
    result = "Reached 7 hit limit.";
  } else {
    text = "Level complete";
    result = `${h - p} over par.`;
  }

  if (
    h < 7 &&
    (persistantLevel.best.length == 0 || persistantLevel.best.length >= h)
  ) {
    persistantLevel.best = state.strikes;
    AddText(-1, height / 2 + 99, "New record", 10);
    UpdatePersistant();
  }

  sendGame(state.level.index, state.strikes.join(";"));

  AddText(-1, height / 2 - 35, text, 10);
  AddText(-1, height / 2 + 35, result, 10);

  plotCanvas.width = width;
  setTimeout(() => {
    setTargetSpeed(15);
    state.travelDestination = GameState.TransitionText;
    AddText();
  }, 3e3);
};

const checkLongestShot = (t = true) => {
  if (state.autoPlay) {
    return;
  }
  const d = Math.round(distanceTravelled / 0.5e5);
  if (d <= persistantLevel.longest.d) {
    return;
  }
  persistantLevel.longest = {
    d,
    p: state.lastStable,
    s: state.strikes[state.strikes.length - 1],
  };

  UpdatePersistant();

  if (!t) {
    return;
  }

  AddText(
    -1,
    height / 2 - 80,
    (Persistant.levels.some((l) => l.longest.d > d) ? "World" : "All time") +
      " length record!",
    10,
    200
  );
};
