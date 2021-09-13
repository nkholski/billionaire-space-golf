import { Clamp } from "./helpers";
import { Planet, vector2 } from "./state";
import { width, height, planetSizeMultiplier } from "./constants";

// (Math.round(90*255/360)).toString(16) 120 10 2 11
// const data =  `Andor,4e59ab93541c3153c946cd4aec7a4a56322a7df1,c3d43e69c4f6f880
// Tatooine,045a44f7d84316a4a6e67ae19801f04477069cb9,b883f372
// Zebes,c8bb9db55d9d54f18db6cb4e71c74b2711d59459,2d12e084
// Arrakis,1c48694b5aec285d538d6eb60a5a17d3e5c2f782,c4f6f880
// Gallifrey,646ca1ef21a613b210408ac1a8794a83c983ec9a,7e2aecc6
// LV-426,66f8f3a65290e35933645da4d3351b62db77c49e,30e8cd89
// Deneb,ad180b180cbca7faeee65b936e44e7eb5b2e19a2,046a93e2cd89
// Phleebhut,664ccb29c8a4b7b7de15d9c117dcded4cca20388,3b45cd89
// Hiveworld,4c747b531a3de2212cab9b38138816a3525d486b,9161a3c2`.split("\n");
//Andor,4e59ab93541c3153cb90521,c3d43e69
const data = `Andoria,408020a233d1ddc882c80e335c846,c3d43e69
Tatooine,00b441316741ad02608f0572943940f7f7808a03215b48c256432,
Zebes,64f031a44951dce2a0a96782320dc,be830cf0
Arrakis,4eeb406ed160f28b41c92321dc5a73a6a7b,76ae604a
Gallifrey,4eeb51e9d320323e22f4f100528800f648e1596dc0564dc,14be3cf0
LV-426,28804191cc50788282f5f7e0ba0a337e38b155032,cdeda41c
Krypton,7fa0532f67f1317dc2b707f3561e83532c80f1e3214177f,347a7182
Phleebhut,7f8030589b71546283f32960fc828,f05a283cf0912814
Hiveworld,5adc30b8ed20778371c13e41fbc8c2e377622867529b428159650,f1996e96`.split(
  "\n"
);

const getSurfacePoint = (planet: Planet, angle: number, ballHalfSize = 1) => ({
  x: Math.round(
    planet.position.x + (planet.size + ballHalfSize) * Math.cos(angle)
  ),
  y: Math.round(
    planet.position.y + (planet.size + ballHalfSize) * Math.sin(angle)
  ),
});

const numFromHex = (hex: string, pos: number, lenght = 1, percentOf?: number) =>
  parseInt(hex.substring(pos, pos + lenght), 16) *
  (percentOf ? percentOf / (lenght == 1 ? 15 : 255) : 1);

export interface NewLevel {
  index: number;
  name: string;
  startAngle: number; // First planet
  startPosition: vector2;
  flagAngle: number;
  flagPosition: vector2;
  par: number;
  planets: Planet[];
  portals: vector2[];
}

export const parseLevel = (d: string, i: number) => {
  const parts = d.split(",");

  //@ts-ignore
  const level: NewLevel = {
    index: i,
    name: parts[0],
    startAngle: numFromHex(parts[1], 0, 2, 2 * Math.PI),
    flagAngle: numFromHex(parts[1], 2, 2, 2 * Math.PI),
    par: Clamp(numFromHex(parts[1], 4), 0, 5),
    planets: [],
    portals: [],
  };

  // level.flagPlanet = numFromHex(parts[1],2);

  for (let i = 5; i < parts[1].length; i += 6) {
    level.planets.push({
      type: numFromHex(parts[1], i),
      size: numFromHex(parts[1], i + 1) * planetSizeMultiplier,
      position: {
        x: numFromHex(parts[1], i + 2, 2, width),
        y: numFromHex(parts[1], i + 4, 2, height),
      },
      baseColor: "#F00",
    });
  }
  for (let i = 0; i < parts[2].length; i += 4) {
    level.portals.push({
      x: numFromHex(parts[2], i, 2, width),
      y: numFromHex(parts[2], i + 2, 2, height),
    });
  }
  level.startPosition = getSurfacePoint(
    level.planets[0],
    level.startAngle,
    2.5
  );
  level.flagPosition = getSurfacePoint(level.planets[1], level.flagAngle);

  return level;
};

export const ParseLevels = data.map(parseLevel);

/*
?   Namn
1   ,
1   StartAngle 0-F
1   FlagAngle 0-F
1   FlagPlanet 0-F
1   Par 0-F
1   PlanetType 0-F
1   PlanetSize 0-F
2   X 00-FF %
2   Y 00-FF %
1   ,
2   PortalX 0-F
2   PortalY 0-F

*/

// const RandomHex = (max=15) => Math.round(max*Math.random()).toString(16);
// const GetRandomPlanet = () => {
//     let str = ",";
//     // startA, flagA, flagP, par
//     for(let i = 0; i<4; i++){
//         str+=RandomHex();
//     }
//     for(let p=0;p<6;p++){
//         str+=RandomHex(3); //planettype
//         for(let i = 0;i<5;i++){
//             str+=RandomHex();
//         }
//     }
//     str+=",";
//     for(let p=0;p<4;p++){
//             str+=RandomHex();
//             str+=RandomHex();

//     }
//     return str;
// }
