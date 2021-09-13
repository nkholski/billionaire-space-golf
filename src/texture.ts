export const textureCanvas: HTMLCanvasElement[] = [];
const textureCtx: CanvasRenderingContext2D[] = [];
const size = 300;

export const CreateTextures = () => {
  const thisCanvas = document.createElement("canvas");
  thisCanvas.width = size;
  thisCanvas.height = size;
  const thisCtx = thisCanvas.getContext("2d");

  for (let i = 0; i < 4; i++) {
    textureCanvas[i] = document.createElement("canvas");
    textureCanvas[i].width = size * 3;
    textureCanvas[i].height = size * 3;
    textureCtx[i] = textureCanvas[i].getContext("2d");

    let texture: number[][] = [];

    for (let x = 0; x < size; x++) {
      texture.push([]);
      for (let y = 0; y < size; y++) {
        texture[x].push(127);
      }
    }

    for (
      let areaSize = size / 3;
      areaSize > 0;
      areaSize = Math.floor(areaSize / 2)
    ) {
      //@ts-ignore
      for (let adjust = 0; adjust <= areaSize / 2; adjust += areaSize / 2) {
        //   const adjust = areaSize%2 ? areaSize/3 : 0;
        for (let x = adjust; x < size - areaSize - adjust; x += areaSize) {
          for (let y = adjust; y < size - areaSize - adjust; y += areaSize) {
            let changePercent =
              (i == 0 ? Math.sqrt(areaSize / 50) : 1) * (0.5 - Math.random());
            //   let value += changePercent*value;
            //            value =  value > 255 ? 255 : (value < 0 ? 0 : value);

            for (let X = Math.floor(x); X < x + areaSize; X++) {
              for (let Y = Math.floor(y); Y < y + areaSize; Y++) {
                // if(Math.random()>0.7){
                //     continue;
                // }

                //texture[X][Y]+= value;
                texture[X][Y] += texture[X][Y] * changePercent;
              }
            }
          }
        }
      }
    }

    const colors = [
      [
        { s: 110, c: "#2C51B6" },
        { s: 150, c: "#009933" },
        { s: 220, c: "#555" },
        { s: 300, c: "#AAA" },
      ],
      [
        { s: 127, c: "#ffa500" },
        { s: 300, c: "#ffd27f" },
      ],
      [
        { s: 127, c: "#DB3700" },
        { s: 150, c: "#000" },
        { s: 190, c: "#db5800" },

        { s: 300, c: "#db5800" },
      ],
      [
        { s: 127, c: "#FFF" },
        { s: 150, c: "#000" },
        { s: 300, c: "#FFF" },
      ],
    ];

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        //   let color = Math.round(texture[x][y]);
        let v = texture[x][y] > 255 ? 255 : texture[x][y];
        //        color = color > 255 ? 255 : (color < 0 ? 0 : color);
        thisCtx.fillStyle = "rgba(" + 1 + "," + 1 + "," + 1 + "," + 255 + ")";

        // console.log(colors,i);

        const c = colors[i].find((col) => v < col.s);

        thisCtx.fillStyle = c.c || "red";

        thisCtx.fillRect(x, y, 1, 1);

        //     id[0] = color > 255 ? 255 : (color < 0 ? 0 : color);
        //     id[1] = color > 255 ? 255 : (color < 0 ? 0 : color);
        //     id[2] = color > 255 ? 255 : (color < 0 ? 0 : color);
        //     id[3] = 125;

        //    thisCtx.putImageData(id , x, y );
        //      thisCtx.putImageData()
      }
    }

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        // textureCtx[i].save();
        thisCtx.save();
        //  thisCtx.scale(x==0?1:-1,y==0?1:-1);
        textureCtx[i].drawImage(
          thisCanvas,
          0,
          0,
          size * 0.9,
          size * 0.9,
          (x + 1) * size,
          (y + 1) * size,
          size,
          size
        );
        // textureCtx[i].restore();
        //  thisCtx.restore();
      }
    }

    textureCtx[i].drawImage(textureCanvas[i], 0, 0, size / 2, size / 2);
    textureCtx[i].drawImage(
      textureCanvas[i],
      0,
      0,
      size / 2,
      size / 2,
      0,
      0,
      size * 3,
      size * 3
    );

    // // textureCtx[i].drawImage(textureCanvas[i],0,0,25,25);
    // // textureCtx[i].drawImage(textureCanvas[i],0,0,25,25,0,0,100,100);

    if (i != 0) {
      textureCtx[i].drawImage(textureCanvas[i], 0, 0, size * 2, size * 2);
      textureCtx[i].drawImage(
        textureCanvas[i],
        0,
        0,
        size * 2,
        size * 2,
        0,
        0,
        size * 3,
        size * 3
      );
    } else {
      textureCtx[i].drawImage(
        textureCanvas[i],
        0,
        0,
        size * 2,
        size * 2,
        0,
        0,
        size * 3,
        size * 3
      );
    }
  }

  // thisCtx.drawImage(textureCanvas[0],0,0,12,12);
  // thisCtx.drawImage(textureCanvas[0],0,0,12,12,0,0,100,100);
  //document.body.appendChild(textureCanvas[2]);
};
