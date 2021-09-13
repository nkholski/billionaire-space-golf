import { getGames } from "./decentralization";
import { Vector2 } from "./physics";
import { clickableBox, drawButtons, getClickValue } from "./button";
import { SpaceText } from "./text";
import { Persistant } from "./localStorage";
import { GameState, GoToGame, Input, state } from "./state";
import { height, width } from "./constants";
import { ctx, canvas, liveCanvas, UpdatePlasma } from "./graphics";

let buttons: clickableBox[];
let selected = 0;
let keyReleased;

const replayLevel = (l, s) => {
  window.history.pushState(
    "",
    state.levels[l].name + " Best Game",
    `${document.location.href.split("?")[0]}?l=${l}&s=${s}`
  );
  GoToGame(l, s);
};

export const UpdateStatsPage = (type?: number) => {
  SpaceText();
  state.level = null;

  const tx = 100 + (!type || type == 2 ? 175 : 0);

  state.click &&
    getClickValue(buttons, Vector2.Sub(state.click, { x: tx, y: 400 }))?.v();

  // canvas.width = width;
  // UpdatePlasma();
  // ctx.drawImage(liveCanvas,0,0);
  // ctx.drawImage(StarSky,0,0);
  ctx.textAlign = "center";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.font = "Bold 30px Arial";
  ctx.textBaseline = "middle";

  ctx.save();
  ctx.translate(tx, 400);

  const header = !type
    ? ["World", "Par", "Best", "This game"]
    : type == 1
    ? ["World", "Par", "Best", "Longest shot (Mkm)", "Games"]
    : ["Name", "World", "Strikes", "Date"];

  // Update buttons and view
  buttons = [
    {
      text: ["Title screen"],
      x: -tx + width - 410,
      y: -400,

      v: () => {
        selected = 0;
        state.gameState = GameState.TitleScreen;
      },
    },
  ];
  header.forEach((s, x) => {
    drawBox(s, x, 0);
  });

  if (type == 2) {
    getGames().forEach((g, y) => {
      if (y > 9) {
        return;
      }
      let [l, s, d] = g.text.split("!");
      drawBox(g.sender, 0, y + 1);
      drawBox(state.levels[l].name, 1, y + 1);
      drawBox(s?.split(";").length, 2, y + 1, () => replayLevel(l, s)); //  const s = Persistant.levels[l].best.join(";");
      drawBox(d + "GMT", 3, y + 1);
    });
  } else {
    state.levels.forEach((l, y) => {
      drawBox(l.name, 0, y + 1);
      drawBox(l.par, 1, y + 1);
      drawBox(Persistant.levels[y].best?.length || "-", 2, y + 1, () =>
        replayLevel(y, Persistant.levels[y].best.join(";"))
      );

      if (type) {
        drawBox(Persistant.levels[y].longest.d || "-", 3, y + 1);
        drawBox(Persistant.levels[y].times, 4, y + 1);
      } else {
        drawBox(state.hits[y], 3, y + 1);
      }
    });

    drawBox(type ? "Full tour" : "Total", 0, 10);
    drawBox(
      state.levels.reduce((a, l) => a + l.par, 0),
      1,
      10
    );
    drawBox(Persistant.best || "-", 2, 10);
    drawBox(
      type ? "-" : state.hits.reduce((a, b) => a + b, 0), //Persistant.levels.reduce((a, l) => (l.longest.d > a ? l.longest.d : a), 0),
      3,
      10
    );
    type && drawBox(Persistant.times, 4, 10);
  }
  drawButtons(buttons, selected);

  if (keyReleased) {
    switch (state.input) {
      case Input.up:
        selected = selected > 0 ? selected - 1 : buttons.length - 1;
        break;
      case Input.down:
        selected = selected < buttons.length - 1 ? selected + 1 : 0;
        break;
      case Input.space:
        buttons[selected].v();
        break;
    }
  }
  keyReleased = !state.input;

  ctx.restore();
};

export const drawBox = (
  s: string | number = "-",
  x: number,
  y: number,
  v?: () => void
) => {
  // const w = x == 1 ? 100 : 360;
  if (s == "-") {
    v = null;
  }
  ctx.textAlign = x == 0 ? "left" : "center";

  const w = 350;
  const X = x * w;
  const Y = y * 55;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.rect(X, Y, w, 55);
  if (y == 0) {
    ctx.fillStyle = "#303";

    ctx.fill();
  }
  ctx.fillStyle = "#FFF";

  ctx.fillText(s as string, X + (x > 0 ? w / 2 : 20), Y + 55 / 2);
  ctx.stroke();

  if (v) {
    buttons.push({
      text: ["View"],
      h: 40,
      w: 80,
      v,
      x: X + w - 85,
      y: Y + 5,
    });
  }
};
