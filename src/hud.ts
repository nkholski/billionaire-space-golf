import { height, width } from "./constants";
export const hudCanvas = document.createElement("canvas");
export const hudCtx = hudCanvas.getContext("2d");

const size = 45;

const degreeWidth = 50;

hudCanvas.width = width;
hudCanvas.height = height;

// export const DrawPower = (power: number, angle: number) => {
//   hudCanvas.width = width;

//   hudCtx.save();
//   hudCtx.translate(
//     width / 2 - ((size + 1) * 10 + degreeWidth) / 2,
//     height - size * 1.5
//   ); // -size*11*10-degreeWidth

//   hudCtx.beginPath();

//   hudCtx.fillStyle = "#33CC33";

//   hudCtx.rect(0, 0, 10 * power * (size + 1), size);
//   hudCtx.fill();

//   hudCtx.beginPath();

//   for (let p = 0; p < 10; p++) {
//     hudCtx.lineWidth = 3;

//     hudCtx.strokeStyle = "#FFF";
//     hudCtx.rect(p * (size + 1), 0, size, size);

//     // if(power>p) {
//     //     hudCtx.fill();

//     // }
//     hudCtx.stroke();
//   }
//   hudCtx.textBaseline = "middle";
//   hudCtx.fillStyle = "#FFF";
//   hudCtx.font = "bold 38px Courier New";
//   //hudCtx.fillText(Math.round(angle)+"°",10*(size+1)+5,size/2);
//   hudCtx.fillText(power, 10 * (size + 1) + 5, size / 2);

//   hudCtx.restore();
// };
