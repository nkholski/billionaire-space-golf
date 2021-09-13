import { state } from "./state";
import { height, width } from "./constants";
// const fontCanvas = document.createElement("canvas");
// const fontCtx = fontCanvas.getContext("2d");

export const txtCanvas = document.createElement("canvas");
export const txtCtx = txtCanvas.getContext("2d");

txtCanvas.width = width;
txtCanvas.height = height;

let texts: {
  text: string | number;
  x: number;
  y: number;
  size: number;
  t?: number;
}[] = [];
let dirty = false;

export const AddText = (
  x?: number,
  y?: number,
  text?: string | number,
  size = 8,
  t: number = null
) => {
  x ? texts.push({ text, x, y, size, t }) : (texts = []);
  dirty = true;
};

let D, T;

const updateHudText = () => {
  txtCtx.fillStyle = "#FFF";
  txtCtx.font = "bold 50px Arial";
  txtCtx.fillText(state.level.name, 10, 50);

  txtCtx.font = "24px Arial";
  [
    `Strikes: ${state.hits[state.level.index]} (Par: ${state.level.par})`,
    `Distance travelled: ${T}M km`,
    `Last shot: ${D}M km`,
  ].forEach((t, i) => {
    txtCtx.fillText(t, 10, 90 + i * 30); //[250, 700, 1300][i]
  });
};

// @ts-ignore
const makeKM = (n: number, fast = true) => (n / 0.5e5).toFixed(1 + fast);

export const UpdateTexts = (d?: number, t?: number, fast?: boolean) => {
  if ((d || d === 0) && makeKM(d, fast) != D) {
    dirty = true;
    D = makeKM(d);
    T = makeKM(d + t);
  }

  if (!dirty) {
    return;
  }

  txtCanvas.width = width;
  txtCtx.fillStyle = "#FFF";
  txtCtx.strokeStyle = "#000";

  (d || d === 0) && updateHudText();

  texts = texts.filter((t) => {
    if (t.t == null || t.t-- > 0) {
      return true;
    }
    dirty = true;
    return false;
  });

  texts.forEach((t) => {
    txtCtx.lineWidth = t.size / 4;

    txtCtx.font = `bold ${t.size * 8}px Arial`;
    const w = txtCtx.measureText(t.text as string).width;
    txtCtx.fillText(
      t.text as string,
      t.x == -1 ? width / 2 - w / 2 : t.x,
      t.y == -1 ? height / 2 : t.y
    );
    txtCtx.strokeText(
      t.text as string,
      t.x == -1 ? width / 2 - w / 2 : t.x,
      t.y == -1 ? height / 2 : t.y
    );
  });
};

// export const UpdateTextsX = () => {
//   texts.forEach((t) => t.t--);
//   texts = texts.filter((t) => {
//     if (t.t > 0) {
//       return true;
//     }
//     dirty = true;
//     return false;
//   });

//   if (!dirty) {
//     return;
//   }

//   txtCanvas.width = width;

//   texts.forEach((t) => {
//     txtCtx.fillStyle = "#FFF";
//     txtCtx.font = "bold 138px Courier New";
//     txtCtx.fillText(t.text, t.x, t.y);
//   });
//   dirty = false;
// };

export const createFont = () => {
  document.body.appendChild(txtCanvas);

  const tmpCanvas: HTMLCanvasElement = document.createElement("canvas");
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  const tmpCtx: CanvasRenderingContext2D = tmpCanvas.getContext("2d");
  tmpCtx.fillStyle = "white";
  tmpCtx.font = "bold 8px Courier New";
  for (let i = 0; i < 26; i++) {
    tmpCtx.fillText(String.fromCharCode(i + 65), i * 10, 50);
  }

  txtCtx.drawImage(tmpCanvas, 0, 0);
};

/*
    Skapa bostäver från font, typ mörkblå, flytta sakta upp/höger och rita över och sista ljusblå så blir 3d och sen skala upp, fyll med svart, och klistra på för outline


*/

const getCanvasAndCtx = () => {
  const tmpCanvas: HTMLCanvasElement = document.createElement("canvas");
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  return [tmpCanvas, tmpCanvas.getContext("2d")] as [
    HTMLCanvasElement,
    CanvasRenderingContext2D
  ];
};

export const resetSpaceText = () => (m = 1000);

let m = 1000;
let sI = 0;
export const SpaceText = () => {
  const fs = 150;
  const target = 2;
  //requestAnimationFrame(SpaceText);
  const [tmpCanvas, tmpCtx] = getCanvasAndCtx();
  //    tmpCtx.fillStyle = "red"
  //   tmpCtx.fillRect(0,0,width,height)
  tmpCtx.fillStyle = "yellow";
  tmpCtx.font = "bold " + fs + "px Arial";
  tmpCtx.textBaseline = "bottom";
  tmpCtx.fillText("BILLIONAIRE", 0, fs);
  tmpCtx.fillText("SPACE GOLF", 0, fs * 2);

  const w = tmpCtx.measureText("SPACE GOLF").width;

  txtCanvas.width = width;
  txtCtx.globalAlpha = 1; //00/m;
  sI++;
  m /= 1.06;

  //m=0;

  for (let y = 0; y < fs * 2; y++) {
    txtCtx.drawImage(
      tmpCanvas,
      0,
      y,
      w,
      1,

      w -
        (y + (m + 3) * Math.sin((m / 20 + sI + y) / 20)) * (target / 2) -
        fs * 2 +
        40, //*Math.sin((y+m)/20),
      80 + (y * target) / 2,
      w / 2 + y * target,
      target / 4
    );
  }

  // txtCtx.drawImage(txtCanvas,0,0,200,300,100,200,300,600)

  //   txtCtx.drawImage(tmpCanvas, 0,0,30,10,0,0,30,10);
};
