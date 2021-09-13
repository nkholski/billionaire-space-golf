import { state, vector2 } from "./state";
import { ctx } from "./graphics";
export interface clickableBox {
  text: string[];
  x: number;
  y: number;
  w?: number;

  h?: number;
  v: any;
  absolute?: boolean;
  doublefat?: boolean;
  hitBox?: { x: number; y: number; x0: number; y0: number };
}

// addClickable(clickableBoxes[0], "1");
// addClickable(clickableBoxes[0], "2", 1);
// addClickable(clickableBoxes[1], "3");
// addClickable(clickableBoxes[1], "4", 1);

export const drawButtons = (clickableBoxes, selected) => {
  //ctx.translate(130, 500);
  clickableBoxes.forEach((b, bI) => {
    ctx.font = "bold 30px Arial";
    ctx.textBaseline = "middle";
    ctx.beginPath();
    ctx.strokeStyle = "white";
    const c = 50 + 50 * Math.sin(state.frame / 7);
    ctx.fillStyle =
      bI == selected ? `rgba(${c / 2},0,${c},1)` : "rgba(0,0,0,0.9)";

    let { x, y } = b;

    b.w = b.w || 400;
    b.h = b.h || 150;

    // x += b.absolute ? 0 : width / 2 - b.w / 2;

    b.hitBox = { x, y, x0: x + b.w, y0: y + b.h };

    ctx.rect(x, y, b.w, b.h);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "white";
    y += b.h / 2;

    b.text.forEach((t, i) => {
      if (i == 1 && !b.doublefat) {
        ctx.font = "20px Arial";
      }
      ctx.fillText(t, x + b.w / 2, y - 10 * (b.text.length - 1 - i * 3));
    });
  });

  ctx.strokeStyle = "white";
};

export const getClickValue = (clickableBoxes, pos: vector2) =>
  clickableBoxes.find(
    (p) =>
      pos.x > p.hitBox.x &&
      pos.y > p.hitBox.y &&
      pos.x < p.hitBox.x0 &&
      pos.y < p.hitBox.y0
  );
