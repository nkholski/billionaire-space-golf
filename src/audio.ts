// Win
// zzfx(...[1.12,.45,295,.02,.45,.78,1,.2,.8,22,11,.02,.18,,,,,.56,,.31]); // Powerup 21
// Bunker
// zzfx(...[,,286,.02,.07,.05,2,1.29,-7.7,.6,,,,.6,,,,.83,.04,.24]); // Shoot 28
// alt [,,224,.02,.02,.08,1,1.7,-13.9,,,,,,6.7]s
// Lava
// zzfx(...[1.26,,441,,.08,.46,2,4.52,.1,,,,,.8,,.6,,.79,.01,.1]); // Explosion 60
// ALt: [,,333,.01,0,.9,4,1.9,,,,,,.5,,.6]
// Studs
//zzfx(...[1.03,,421,.01,.07,,2,1.81,-9.9,1,,-0.01,,.1,,,,.87,.01]); // Jump 80 - Mutation 1
// zzfx(...[2.01,,62,.02,.07,0,,.11,3.2,,,,,,,,.18,.76,.05,.06]); // Shoot 95
// zzfx(...[1.03,,421,.01,.07,,1,1.81,-9.9,1,,,,,,,,.87,.01]); // Jump 80

// Slå
// zzfx(...[1.05,,108,,.03,.14,4,2.03,9.2,1.9,,,,.1,,.1,,.54,.02]); // Hit 118

// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
// Feel free to minify it further for your own needs!

let zzfx, zzfxV, zzfxX;

// ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.8 ~ 884 bytes minified
zzfxV = 0.3; // volume

zzfx = (
  // play sound
  p = 1,
  k = 0.05,
  b = 220,
  e = 0,
  r = 0,
  t = 0.1,
  q = 0,
  D = 1,
  u = 0,
  y = 0,
  v = 0,
  z = 0,
  l = 0,
  E = 0,
  A = 0,
  F = 0,
  c = 0,
  w = 1,
  m = 0,
  B = 0
) => {
  //@ts-ignore
  zzfxX = zzfxX || new (window.AudioContext || webkitAudioContext)(); // audio context
  let // @ts-ignore
    M = Math,
    R = 44100,
    d = 2 * M.PI,
    G = (u *= (500 * d) / R / R),
    //@ts-ignore
    C = (b *= ((1 - k + 2 * k * M.random((k = []))) * d) / R),
    g = 0,
    H = 0,
    a = 0,
    n = 1,
    I = 0,
    J = 0,
    f = 0,
    x,
    h;
  e = R * e + 9;
  m *= R;
  r *= R;
  t *= R;
  c *= R;
  y *= (500 * d) / R ** 3;
  A *= d / R;
  v *= d / R;
  z *= R;
  l = (R * l) | 0;
  for (h = (e + m + r + t + c) | 0; a < h; k[a++] = f)
    ++J % ((100 * F) | 0) ||
      ((f = q
        ? 1 < q
          ? 2 < q
            ? 3 < q
              ? M.sin((g % d) ** 3)
              : M.max(M.min(M.tan(g), 1), -1)
            : 1 - (((((2 * g) / d) % 2) + 2) % 2)
          : 1 - 4 * M.abs(M.round(g / d) - g / d)
        : M.sin(g)),
      (f =
        (l ? 1 - B + B * M.sin((d * a) / l) : 1) *
        (0 < f ? 1 : -1) *
        M.abs(f) ** D *
        p *
        zzfxV *
        (a < e
          ? a / e
          : a < e + m
          ? 1 - ((a - e) / m) * (1 - w)
          : a < e + m + r
          ? w
          : a < h - c
          ? ((h - a - c) / t) * w
          : 0)),
      (f = c
        ? f / 2 +
          (c > a ? 0 : ((a < h - c ? 1 : (h - a) / c) * k[(a - c) | 0]) / 2)
        : f)),
      (x = (b += u += y) * M.cos(A * H++)),
      (g += x - x * E * (1 - ((1e9 * (M.sin(a) + 1)) % 2))),
      n && ++n > z && ((b += v), (C += v), (n = 0)),
      !l || ++I % l || ((b = C), (u = G), (n = n || 1));
  p = zzfxX.createBuffer(1, h, R);
  p
    //@ts-ignore
    .getChannelData(0)
    .set(k);
  b = zzfxX.createBufferSource();
  //@ts-ignore
  b.buffer = p;
  //@ts-ignore
  b.connect(zzfxX.destination);
  //@ts-ignore

  b.start();
  return b;
};

export const audioCool = {
  bounce: 0,
};
export enum SoundEffect {
  Win = 0,
  Bunker = 1,
  Lava = 2,
  Bounce = 3,
  Strike = 4,
  Portal = 5,
  Resurrect = 6,
  OB = 7,
  Disaster = 8,
}
export const PlaySound = (s: SoundEffect) =>
  zzfx(
    ...[
      [
        ,
        ,
        80,
        0.3,
        0.4,
        0.7,
        2,
        0.1,
        -0.73,
        3.42,
        -430,
        0.09,
        0.17,
        ,
        ,
        ,
        0.19,
      ],
      [
        2.74,
        0.2,
        400,
        ,
        0.1,
        0.03,
        2,
        1.5,
        ,
        ,
        ,
        ,
        ,
        0.3,
        11,
        0.3,
        0.11,
        ,
        ,
        0.09,
      ], //[2.23,,123,,.06,.15,2,2.7,-0.6,-1,,,,.5,,,.02,.6,.03,.03],
      [
        1.26,
        ,
        441,
        ,
        0.08,
        0.46,
        2,
        4.52,
        0.1,
        ,
        ,
        ,
        ,
        0.8,
        ,
        0.6,
        ,
        0.79,
        0.01,
        0.1,
      ],
      [1.03, , 421, 0.01, 0.07, , 1, 1.81, -9.9, 1, , , , , , , , 0.87, 0.01],
      [
        1.83,
        ,
        367,
        ,
        ,
        0.08,
        3,
        1.19,
        8.9,
        7.5,
        ,
        ,
        ,
        0.6,
        ,
        0.4,
        0.08,
        0.55,
        0.09,
        0.18,
      ], //[1.05,,108,,.03,.14,4,2.03,9.2,1.9,,,,.1,,.1,,.54,.02],
      [, , 1e3, , , 0.5, , , , , 99, 0.01, 0.03], // Warp[,,539,0,.04,.29,1,1.92,,,567,.02,.02,,,,.04], //
      [
        2.04,
        ,
        155,
        0.06,
        0.18,
        0.91,
        ,
        1.42,
        ,
        0.7,
        152,
        0.08,
        0.08,
        ,
        ,
        ,
        0.13,
        0.75,
        0.09,
        0.35,
      ],
      [2, 0, 0, , , 0.6, 4, 0, 3, , , , , , , 0.05, 0.4, , 0.1], //[2,0,0,.1,,1.5,4,0,333,,,,,,,.05,.27,,.17]
      [, 0, 80, , , 0.6, , 2.32, 555, -54, 332, , , , -290, , , , 0.5, 0.01],
    ][s]
  );

// WARP? [,,394,.09,.21,.18,,1.35,,,581,.04,.04,,,,,.84,.08,.38]

// export const playSong = (i = 0) => {
//   //https://xem.github.io/midi2array/
//   // const blob = [{"deltaTime":1536,"channel":0,"type":"channel","noteNumber":62,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":62,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":63,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":63,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":67,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":67,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":66,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":66,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":67,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":67,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":66,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":66,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":65,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":65,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":66,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":66,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":73,"velocity":90,"subtype":"noteOn"},{"deltaTime":572,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":73,"velocity":90},{"deltaTime":4,"channel":0,"type":"channel","noteNumber":70,"velocity":90,"subtype":"noteOn"},{"deltaTime":572,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":70,"velocity":90},{"deltaTime":4,"channel":0,"type":"channel","noteNumber":67,"velocity":90,"subtype":"noteOn"},{"deltaTime":896,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":67,"velocity":90},{"deltaTime":448,"channel":0,"type":"channel","noteNumber":67,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":67,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":70,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":70,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":73,"velocity":90,"subtype":"noteOn"},{"deltaTime":128,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":73,"velocity":90},{"deltaTime":64,"channel":0,"type":"channel","noteNumber":76,"velocity":90,"subtype":"noteOn"},{"deltaTime":572,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":76,"velocity":90},{"deltaTime":4,"channel":0,"type":"channel","noteNumber":75,"velocity":114,"subtype":"noteOn"},{"deltaTime":764,"channel":0,"type":"channel","subtype":"noteOff","noteNumber":75,"velocity":114},{"deltaTime":0,"type":"meta","subtype":"endOfTrack"}]

//   const blip = [1.48, 0, 73.41619, , , , 3, 0.8];
//   const f = [62, 63, 67, 66, 67, 66, 65, 66, 73, 70, 67, 67, 70, 73, 76, 75][i]; // [69,75,73,69,72,75,73,69,75,73,69,72,75,73,69,72,69,75,73,69,72,75,73,69,75,73,69,72,75,73,69,72][i];
//   const tone = [...blip];
//   tone[2] = f;

//   console.log(i);

//   zzfx(...tone);

//   setTimeout(() => playSong(i + 1), 500);
// };

// const playNote = () => {
//      // Play the note
//      const D:number[] = [];
//      const V = 1;
//      const u = 1;
//   const A = new AudioContext;
//   const m = A.createBuffer(1, 1e6, 44100);
//   let i=0;
// let e =0;
//   let b = (t, a, i, r) => { e = r; Math.sin(e / t * 6.28 * a + i);}

//   //@ts-ignore
//   const w = (t) =>  Math.sin(e / 44100 * t * 6.28 + b(e, 44100, t, 0) ** 2 + .75 * b(e, 44100, t, .25) + .1 * b(e, 44100, t, .5));
//   D[i] =

//     // The first 88 samples represent the note's attack
//     i < 88 ? i / 88.2 * w(i)
//     // The other samples represent the rest of the note
//     : (1 - (i - 88.2) / (44100 * (V - .002))) ** (u ? (.5 * Math.log(1e4 * e / 44100)) ** 2 : 1) * w(i);

//     //
//   m.getChannelData(0).set(D);
//   const s = A.createBufferSource();
//   s.buffer = m;
//   s.connect(A.destination);
//   s.start();
// }

// playNote();

const baseTone = [0.5, 0, 174.6141, , 0.1, , , 0, , , , , , , , , , 0.5, 0.1]; //[, 0, 65.40639, , 0.1, 3, , 3, , , , , , , , , , 0.79, 1];
let sI = -1;
let earliest = Date.now();
const song = "GEGBGEGBBGEGBBAGEGBBB"; //"A1101030GEGB0GEGBBGEGB0B40"; // D0A0A0
const tones = {
  // D: 146.8324,
  // 0: 92.499,
  A: 220,
  // 1: 69.296,
  // 3: 116.541,
  G: 195.9977,
  E: 164.8138,
  B: 246.9417,
  4: 77.782,
};
export const playSong = (n?: number) => {
  if (n == 2) {
    sI = -9;
    earliest = Date.now() + 3e4;
  }
  if (n == 1) {
    if (sI > -1 || Date.now() < earliest) {
      return;
    }
    sI = 0;
    earliest = Date.now() + 2e4; // Don't repeat more than every 30 second
  }
  if (sI < 0 || sI >= song.length) {
    sI = -9;
    return;
  }

  // F#=0 C#=1 A# = 3 D# =4

  let tone = song.substr(sI, 1);

  baseTone[2] = tones[tone];

  document.hasFocus() && zzfx(...baseTone);

  sI++;
  setTimeout(() => playSong(), 500);
};
