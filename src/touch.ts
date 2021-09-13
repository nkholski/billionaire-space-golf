import { state, Input } from "./state";
import { width, height } from "./constants";
import { Vector2 } from "./physics";
import { vector2 } from "~state";
import { screenCanvs } from "./graphics";
// let triedFullscreen = false;

const touchToOffset = (e) => {
  const { target, targetTouches } = e;
  const rect = target.getBoundingClientRect();
  return {
    x: targetTouches[0].pageX - rect.left,
    y: targetTouches[0].pageY - rect.top,
  };
};

// const openFullscreen = () => {
//   if (triedFullscreen) {
//     return;
//   }
//   triedFullscreen = true;
//   if (!confirm("Switch to fullscreen for a better touch experience?")) {
//     return;
//   }
//   document.body.requestFullscreen();
//     if (screenCanvs.requestFullscreen) {
//       screenCanvs.requestFullscreen();
//       // @ts-ignore
//     } else if (screenCanvs.mozRequestFullScreen) {
//       /* Firefox */
//       // @ts-ignore
//       screenCanvs.mozRequestFullScreen();
//       // @ts-ignore
//     } else if (screenCanvs.webkitRequestFullscreen) {
//       /* Chrome, Safari & Opera */
//       // @ts-ignore
//       screenCanvs.webkitRequestFullscreen();
//       // @ts-ignore
//     } else if (screenCanvs.msRequestFullscreen) {
//       /* IE/Edge */
//       // @ts-ignore
//       screenCanvs.msRequestFullscreen();
//     }
// };

interface TouchState {
  startPos: vector2;
  currentPos: vector2;
  magnitude: number;
  vector: vector2;
  execute: vector2;
  wasTouched: boolean;
}

export const resetTouch = () => {
  touchState.startPos = null;
  touchState.currentPos = null;
  touchState.execute = null;
  touchState.magnitude = null;
  touchState.vector = null;
};

//@ts-ignore
export const touchState: TouchState = {
  wasTouched: false,
};

resetTouch();

const fixXY = ({ x, y }) => ({
  x: (width * (x - screenCanvs.offsetLeft)) / screenCanvs.scrollWidth,
  y: (height * (y - screenCanvs.offsetTop)) / screenCanvs.scrollHeight,
});

export const startListenders = () => {
  window.addEventListener(
    "keydown",
    (e: KeyboardEvent) =>
      (state.input = e.key == "Enter" ? Input.space : (e.key as Input))
  );

  window.addEventListener("keyup", (e: KeyboardEvent) => (state.input = null));

  // INTERACTION START
  const mouseDown = ({ x, y }: { x: number; y: number }) => {
    touchState.wasTouched = true;
    touchState.startPos = fixXY({ x, y });
    mouseMove({ x, y });

    // if (buttons.length > 0) {
    //   dialogClick();
    //   return;
    // }
    // dialogText = "";
    // buttons = [];
    // state == GameStates.game ? startInteraction(x, y) : startLevel();
  };
  screenCanvs.onmousedown = (e) => mouseDown({ x: e.offsetX, y: e.offsetY });
  screenCanvs.ontouchstart = (e) => mouseDown(touchToOffset(e));

  // INTERACTION MOVE
  const mouseMove = ({ x, y }: { x: number; y: number }) => {
    if (!touchState.startPos) {
      return;
    }
    touchState.currentPos = fixXY({ x, y });
    touchState.vector = Vector2.Sub(touchState.currentPos, touchState.startPos);
    touchState.magnitude = Vector2.Magnitude(touchState.vector);
  };

  screenCanvs.onmousemove = (e) => {
    e.preventDefault;
    mouseMove({ x: e.offsetX, y: e.offsetY });
  }; //  e.prevent

  screenCanvs.addEventListener(
    "touchmove",
    (e) => mouseMove(touchToOffset(e)),
    {
      passive: false,
    }
  );

  //@ts-ignore
  const mouseUp = () => {
    touchState.execute = touchState.startPos;
    touchState.startPos = null;
  };

  //const cancelMove = //(inputState.startPos = null);
  // INTERACTION EXECUTE
  //   const mouseUp = () =>
  //     isPortrait() ? null : executeMove(position.x, position.y);

  screenCanvs.onmouseup = (e) => mouseUp();
  //@ts-ignore
  screenCanvs.ontouchend = (e) => mouseUp();
  // INTERACTION CANCEL
  screenCanvs.onmouseout = screenCanvs.ontouchcancel = () => {};
};
