import { setSpeed, StarMovement } from "./stars";
import { NewLevel, ParseLevels } from "./levels";
export interface vector2 {
  x: number;
  y: number;
}

export enum Input {
  left = "ArrowLeft",
  right = "ArrowRight",
  up = "ArrowUp",
  down = "ArrowDown",
  space = " ",
}

export enum PlanetType {
  Normal = 0,
  Sand = 1,
  Sun = 2,
  Negative = 3,
}

export interface Planet {
  position: vector2;
  size: number;
  type: PlanetType;
  baseColor: string;
}

interface MainState {
  frame: number;
  click?: vector2;
  position: vector2;
  lastStable: vector2;

  velocity: vector2;

  disabledCollider: number;

  singleLevel: number;

  hits: number[];

  currentPlanet: Planet;

  gameState: GameState;

  travelState: StarMovement;

  travelDestination: GameState;

  strikes: string[];

  autoPlay: boolean;

  levels: NewLevel[];

  input: Input;

  level: NewLevel;
}

export const GetSystem = () => {
  const system: Planet[] = [];
  // for(var i=0;i< 10; i++){
  //     system.push({
  //         mass: 100000 + 100000    * Math.random(),
  //         position: {x: 1920 * Math.random(),
  //         y: 1080*Math.random() }
  //         ,
  //         size: 100 + 100*Math.random()
  //     });
  // }

  for (var i = 0; i < 3; i++) {
    const mass = 80000 + 40000 + (i == 2 ? 30000 : 0); //    * Math.random(),
    if (i == 1) {
      //continue;
    }

    let type = [PlanetType.Normal, PlanetType.Sun, PlanetType.Sand][i];

    system.push({
      position: {
        x: (i * 1400) / 2 + 520 / 2,
        y: 1080 / 2 + 300 * Math.sin(i * (90 / 57)),
      },
      size: mass / 1000,
      type,
      baseColor: ["#99F", "#DD0", "#F00"][type],
    });

    // if(i==1) {
    //     system.push({
    //         mass,
    //         position: {x: i * 1400/2 + 520/2,
    //         y: 1080/2 - 300 * Math.sin(i*(90/57))},
    //         size: mass/1000,
    //         type: PlanetType.Negative,
    //         baseColor: "#FFF"
    //     });
    // }
  }

  system[1].size /= 1.5;
  //s  system[1].mass/=1.5;

  return system;
};

// const system = GetSystem();
// const flagAngle = 45/57;

export enum GameState {
  TransitionText,
  Stats,
  TitleScreen,
  Aiming,
  Waiting,
  Dead,
  Won,
  GameEnd,
  IDLE,

  NEAR,
}

export type Level = Readonly<{
  start: vector2;
  position: vector2;
  system: Planet[];
  flag: {
    planet: Planet;
    angle: number;
    foot: vector2;
  };
  currentPlanet: Planet;
  portal: vector2[];
}>;

// export const XXXlevels: Level[] = [
//   {
//     start: getSurfacePoint(system[0], 10 / 57, 2.5),
//     position: getSurfacePoint(system[0], 10 / 57, 2.5),
//     system: system,
//     flag: {
//       planet: system[system.length - 1],
//       angle: flagAngle,
//       foot: getSurfacePoint(system[system.length - 1], flagAngle),
//     },
//     portal: [
//       {
//         x: 1500,
//         y: 50,
//       },
//       {
//         x: 1000,
//         y: 600,
//       },
//     ],
//     currentPlanet: system[0],
//   },
//   {
//     start: getSurfacePoint(system[0], 90 / 57, 2.5),
//     position: getSurfacePoint(system[0], 90 / 57, 2.5),
//     system: system,
//     flag: {
//       planet: system[system.length - 1],
//       angle: flagAngle * 313,
//       foot: getSurfacePoint(system[system.length - 1], flagAngle * 313),
//     },
//     portal: [],
//     currentPlanet: system[0],
//   },
// ];

//@ts-ignore
export const state: MainState = {
  frame: 0,
  input: null,
  levels: ParseLevels,
  singleLevel: -1,
  hits: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  travelState: StarMovement.Stable,
  travelDestination: GameState.TitleScreen,
};
// start: getSurfacePoint(system[0], 90/57),
// position: getSurfacePoint(system[0], 90/57),
// velocity: {x: 9, y:9},
// system: system,
// disabledCollider:0,
// mouse: {x:0,y:0},
// flag:  {
//     planet: system[system.length-1],
//     angle: flagAngle,
//     foot: getSurfacePoint(system[system.length-1],flagAngle)
// },
// hits: 0,
// currentPlanet: system[0],
// gameState: GameState.Aiming,
//     ...levels[0]
// };

export const LoadLevel = (level: number) => {
  // const levels2 = ParseLevels();
  // console.log(levels2);
  state.velocity = { x: 9, y: 9 };
  state.level = ParseLevels[level];
  // state.start = {...levels[level].start}
  state.position = { ...ParseLevels[level].startPosition };
  state.lastStable = { ...ParseLevels[level].startPosition };
  // state.system = [...levels[level].system]
  // state.flag = {...levels[level].flag}
  state.currentPlanet = { ...ParseLevels[level].planets[0] };
  state.strikes = [];
  state.autoPlay = false;
  //state.portal = [...levels[level].portal]
  state.disabledCollider = 0;
};

export const StateFromQuery = () => {
  const p = new URLSearchParams(window.location.search);
  const l = p.get("l");
  const s = p.get("s");
  if (!l || !s) {
    // LoadLevel(0); state.gameState = GameState.Aiming; return;
    setSpeed(3);
    state.gameState = GameState.TitleScreen;
    return;
  }
  GoToGame(l as unknown as number, s);
};

export const GoToGame = (l: number, s: string) => {
  //@ts-ignore
  LoadLevel(l);
  //@ts-ignore
  state.singleLevel = l;

  state.strikes = s.split(";");
  state.autoPlay = true;
  state.gameState = GameState.Aiming; //GameState.Loading;
};

// StateFromQuery();
