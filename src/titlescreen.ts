import { isSignedIn, loginNear } from "./decentralization";
import { Vector2 } from "./physics";
import { drawButtons, getClickValue } from "./button";
import { openFullscreen } from "./scaletofit";
import { Persistant } from "./localStorage";
import { touchState } from "./touch";
import { resetSpaceText, txtCanvas } from "./text";
import {
  setTargetSpeed,
  StarSky,
  starsIsDone,
  getScreenLayerPosition,
  StarMovement,
} from "./stars";
import { width, height } from "./constants";
import { playSong } from "./audio";
import { GameState, Input, LoadLevel, state, vector2 } from "./state";
import { ctx, liveCanvas, UpdatePlasma } from "./graphics";
import { debug } from "webpack";
import { SpaceText } from "./text";

let selected: number;

//http://www.p01.org/music_for_tiny_airports/

//const  a = ()=>{with(new AudioContext)with(createScriptProcessor(k=8192,t=0,1))connect(destination),onaudioprocess=x=>{for(i=0;i<k;t+=2e-5)x.outputBuffer.getChannelData(0)[i++]='%,IW7:A'.charCodeAt(i%7)*t%.1*(1-t/(Math.tan(i%7)+9)%1)}};

//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM

//@ts-ignore
// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
// const zzfx=(...t)=>zzfxP(zzfxG(...t))

// // zzfxP() - the sound player -- returns a AudioBufferSourceNode
// const zzfxP=(...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);t.map((d,i)=>f.getChannelData(i).set(d)),e.buffer=f,e.connect(zzfxX.destination),e.start();return e}

// // zzfxG() - the sound generator -- returns an array of sample data
// const zzfxG=(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);return Z}

// // zzfxV - global volume
// const zzfxV=.3

// // zzfxR - global sample rate
// const zzfxR=44100

// // zzfxX - the common audio context

// const zzfxX=new(window.AudioContext||webkitAudioContext);

// const zzfx=       // play sound
// (p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0)=>{let
// M=Math,R=44100,d=2*M.PI,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,g=0,H=0,a=0,n=1,I=0
// ,J=0,f=0,x,h;e=R*e+9;m*=R;r*=R;t*=R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;for(h=e+m+
// r+t+c|0;a<h;k[a++]=f)++J%(100*F|0)||(f=q?1<q?2<q?3<q?M.sin((g%d)**3):M.max(M.min(M.tan(g),1)
// ,-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.round(g/d)-g/d):M.sin(g),f=(l?1-B+B*M.sin(d*a/l):1)*(0<f?1:
// -1)*M.abs(f)**D*p*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/
// 2+(c>a?0:(a<h-c?1:(h-a)/c)*k[a-c|0]/2):f),x=(b+=u+=y)*M.cos(A*H++),g+=x-x*E*(1-1E9*(M.sin(a)
// +1)%2),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.createBuffer(1,h,R);p.
// getChannelData(0).set(k);b=zzfxX.createBufferSource();b.buffer=p;b.connect(zzfxX.destination
// );b.start();return b};zzfxX=new (window.AudioContext||webkitAudioContext) // audio context

// const zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}

// const songData = [
//     [
//         [,0,22,,.07,.07,2,0,,,.5,.01],[2,0,426,.01,.2,.48,,44,,,200,,,.1],[2,0,426,,.02,.2,,44,,,200,,,.1],[,0,84,,,,,.7,,,,.5,,6.7,1,.05],[2,0,4e3,,,.03,2,1.25,,,,,.02,6.8,-.3,,.5],
//         [,0,209,,.02,.25,3],[,0,655,,,.09,3,1.65,,,,,.02,3.8,-.1,,.2]],[[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,]
//     ],
//         [
//         [,-1,15,,,,15,,,,15,,15,,15,,15,,,,15,,15,,,,15,,15,,17,,20,,22,,,,22,,,,22,,17,,20,,22,,,,,,,,,,,,17,,20,,17,,]
//     ],  [
//         [,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,],
//         [1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
//         [2,1,,,,,,,,,,,34.5,,,,,,34,,,,,,34.5,,,,,,34.5,,34,,,,,,,,,,,,34.5,,,,,,34,,,,,,34.5,,,,,,34.5,,34,,]],[[,-1,15,,,,15,,,,15,,15,,15,,15,,,,15,,15,,,,15,,15,,17,,20,,22,,,,22,,,,22,,17,,20,,22,,,,,,,,,,,,17,,20,,17,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34,,,,,,34.5,,,,,,34.5,,34,,,,,,,,,,,,34.5,,,,,,34,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,15,,,,15,,,,15,,15,,15,,15,,,,15,,15,,,,15,,15,,17,,20,,22,,,,22,,,,22,,17,,20,,22,,,,,,,,,,,,17,,20,,17,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,],[5,1,22.5,,,,22.5,,,,22.5,,22.5,,,,22.5,,,,22.5,,,,22.5,,22.5,,,,22.5,,22.5,,20.5,,,,20.5,,,,20.5,,20.5,,,,20.5,,,,20.5,,,,20.5,,20.5,,,,20.5,,20.5,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,15,,,,15,,,,15,,15,,15,,15,,,,15,,15,,,,15,,15,,17,,20,,22,,,,22,,,,22,,17,,20,,22,,,,,,,,,,,,17,,20,,17,,],[5,1,27.5,,,,27.5,,,,27.5,,27.5,,,,27.5,,,,27.5,,,,27.5,,27.5,,,,27.5,,27.5,,22.5,,,,22.5,,,,22.5,,22.5,,,,22.5,,,,22.5,,,,22.5,,22.5,,,,22.5,,22.5,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,],[5,1,10,,13,,,,15,,17,,,,20,,22,,,,20,,,,17,,22,,22,,17,,20,,,,,,,,,,,,,,,,,,,,,,20,,17,,20,,22,,25,,27,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,15.26,,,,15.26,,,,15.26,,15.26,,15.26,,15.26,,,,15.26,,15.26,,,,15.26,,15.26,,17.26,,20.26,,22.26,,,,22.26,,,,22.26,,17.26,,20.26,,22.26,,,,,,,,,,,,17.26,,20.26,,17.26,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[5,1,,,27,,25,,,,27,,,,25,,27,,,,25,,22,,20,,22,,,,18,,20,,22,,,,22,,,,22,,,,22,,,,25,,22,,,,25,,,,22,,25,,22,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]]],[0,1,2,3,4,5,4,5,6,7,6,7,8,9,8,9,6,7,6,7,0,8,9,8,9,6,7,6,7],187.5,{"title":"Cuddly Demos - Main Menu","notes":"This is a conversion of the main menu tune from the Atari ST demo 'The Cuddly Demos', by The Carebears. The original was composed by Jochen Hippel (aka. MadMax). This pattern data was taken from a MOD file - I have no idea who converted it."}];

// const songData = [[[2,0,261.6255653005986,,1,,1,,,,,,0.2,,,,0.01,0.5,0.01,0.2],[,0,130.8127826502993,,1,,,2,,,0.5,,,,,0.1,,0.4,0.05],[1.3,0,65.40639132514966,,0.02,,,1.5,,,,,,5,,,,0.7,0.02],[0.5,0,260,,,0.04,,,,,,,0.1,99,,,,2,0.005,0.2]],[[[0,0,,12,12,-1,,,17,17,-1,,,17,17,-1,,,14,12,12,-1,,17,17,-1,,,17,17,-1,,,14,14,12,12,-1,12,17,-1,,,17,17,-1,,,14,14,-1,12,12,12,12,-1,,,17,17,-1,,,14,14,-1,,12,12,12,-1,,,17,17,-1,,,17,14,-1,,,12,12,-1,,,17,17,-1,,,17,17,-1,,,14,12,12,-1,,17,17,-1,,,17,17,-1,,,14,14,12,12,-1,12,17,-1,],[1,0,,,,,26,-1,,,33,-1,,,,,,,,,,,26,-1,26,-1,,,,,,,,,,,,,26,-1,,,33,-1,,,,,,,,,,,26,-1,26,-1,,,,,,,,,,,,,26,-1,,,33,-1,,,,,,,,,,,26,-1,26,-1,,,,,,,,,,,,,26,-1,,,33,-1,,,,,,,,,,,26,-1,26,-1],[2,0,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,,12,-1,,],[3,0,,17,12,-1,,,12,-1,,17,12,17,-1,,12,-1,,17,12,-1,,,12,-1,,17,12,17,-1,,12,-1,,17,12,-1,,,12,-1,,17,12,17,-1,,12,-1,,17,12,-1,,,12,-1,,17,12,17,-1,,12,-1,,17,12,-1,,,12,-1,,17,12,17,-1,,12,-1,,17,12,-1,,,12,-1,,17,12,17,-1,,12,-1,,17,12,-1,,,12,-1,,17,12,17,-1,,12,-1,,17,12,-1,,,12,-1],[3,0,,,,,,,,,,,,,,,17,-1,,,,,,,,,,,,,,,17,-1,,,,,,,,,,,,,,,17,-1,,,,,,,,,,,,,,,17,-1,,,,,,,,,,,,,,,17,-1,,,,,,,,,,,,,,,17,-1,,,,,,,,,,,,,,,17,-1,,,,,,,,]]],[0],100]

// const songData = [
//     [69,75,73,69,72,75,73,69,75,73,69,72,75,73,69,72,69,75,73,69,72,75,73,69,75,73,69,72,75,73,69,72],
//     [69,75,73,69,72,75,73,69,75,73,69,72,75,73,69,72,69,75,73,69,72,75,73,69,75,73,69,72,75,73,69,72],
//     [69,75,73,69,72,75,73,69,75,73,69,72,75,73,69,72,69,75,73,69,72,75,73,69,75,73,69,72,75,73,69,72],

//     /* speed (BPM) */
//   ];

// const buffer = zzfxM(...songData);    // Generate the sample data
// const node = zzfxP(...buffer);        // Play the song

let selectionCoord = { x: 0, y: 0 };

//let destination = -1;
let keyReleased = true;
let titleScreenStep = 0;
export const updateTitleScreen = () => {
  playSong(1);

  state.autoPlay = false;
  if (titleScreenStep > 0 || state.travelState == StarMovement.Stable) {
    if (titleScreenStep == 0) {
      resetSpaceText();
      titleScreenStep++;
    }
    SpaceText();
  }
  // updateScreen();
  state.hits = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  state.level = null;

  if (keyReleased) {
    switch (state.input) {
      case Input.left:
        selectionCoord.x += selectionCoord.x > 0 ? -1 : 3;
        break;
      case Input.right:
        selectionCoord.x += selectionCoord.x < 3 ? 1 : -3;
        break;
      case Input.up:
        selectionCoord.y += selectionCoord.y > 0 ? -1 : 2;
        break;
      case Input.down:
        selectionCoord.y += selectionCoord.y < 2 ? 1 : -2;
        break;
    }
  }

  keyReleased = !state.input;
  let selected = selectionCoord.x + selectionCoord.y * 4;

  if (state.input == Input.space) {
    //openFullscreen();
    state.singleLevel = -1;
    clickableBoxes[selected].v();
    state.input = null;
    return;
    // setTargetSpeed(15);
    // state.travelDestination = GameState.TransitionText;
  }

  //   if (starsIsDone() && destination != -1) {
  //     setTargetSpeed(0.01);

  //     // setSpeed(2);
  //   }

  const xM = width / 8;
  const yM = xM * 0.45;
  const space = width / 25;
  ctx.strokeStyle = "white";
  ctx.font = "bold 30px Arial";
  let i = -1;

  const sX = (width - 4 * (xM + space)) / 2;

  ctx.clearRect(0, 0, width, height);
  // UpdatePlasma();
  // ctx.drawImage(liveCanvas,0,0);
  // ctx.drawImage(StarSky,0,0);
  ctx.textAlign = "center";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.fillText("Ⓒ2021 - Nelson Berg, Mio Berg & Niklas Berg", width / 2, 455);
  // ctx.textAlign = "left";

  ctx.fillText("Touch, click or use arrow keys + space", width / 2, 1050);

  ctx.drawImage(txtCanvas, 0, 0);

  //   for (let y = 0; y < 3; y++) {
  //     for (let x = 0; x < 4; x++) {
  //       const l = i++ < 11 ? state.levels[i] : null;
  //       ctx.save();
  //       ctx.translate(
  //         warp * getScreenLayerPosition() + sX + x * (xM + space),
  //         500 + y * (yM + space)
  //       );
  //       ctx.beginPath();

  //       ctx.fillStyle = "rgba(0,0,0,0.5)";

  //       ctx.fillRect(0, 0, xM, yM);
  //       ctx.fillStyle = "white";

  //       ctx.rect(0, 0, xM, yM);

  //       if (l) {
  //         // ctx.fillText(l.name,5,25);
  //         ctx.fillText(
  //           getBest(i) > 0 ? "Best: " + getBest(i) : "Unplayed",
  //           5,
  //           55
  //         );
  //         // ctx.fillText("Par: "+l.par,5,85);
  //       }

  //       if (i == 9) {
  //         ctx.fillText("Random", 5, 25);
  //         // ctx.fillText(getBest(i) > 0? "Best: "+getBest(i) : "Unplayed",5,55);
  //         // ctx.fillText("Par: "+l.par,5,85);
  //       }
  //       ctx.stroke();
  //       ctx.restore();
  //     }
  //   }

  // if(inputState.left) {
  //     selection--;
  // }
  // if(inputState.right) {
  //     selection++;
  // }

  // inputState.left = false;
  // inputState.right = false;

  ctx.save();
  ctx.translate(120, 500);
  ctx.textAlign = "center";

  if (isSignedIn()) {
    clickableBoxes[8].text = ["View other's games"];
    clickableBoxes[8].v = () => (state.gameState = GameState.NEAR);
  } else {
    clickableBoxes[8].text = ["Login to Near", "view/share games"];
    clickableBoxes[8].v = () => loginNear();
  }

  drawButtons(clickableBoxes, selected);
  ctx.restore();
  if (state.click) {
    state.singleLevel = -1;
    openFullscreen();
    titleScreenStep = 0;

    getClickValue(
      clickableBoxes,
      Vector2.Sub(state.click, { x: 120, y: 500 })
    )?.v();
  }
};

// https://dopeloop.ai/melody-generator/?s=6142676814371812

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

  highlight?: boolean;
}

const clickableBoxes: clickableBox[] = [];

for (let i = 0; i < 9; i++) {
  const s = Persistant.levels[i];
  clickableBoxes.push({
    text: [
      `${i + 1}. ${state.levels[i].name}`,
      `Best: ${s.best ? s.best.length : "-"}  Par: ${state.levels[i].par}`,
    ],
    v: () => {
      setTargetSpeed(15);
      state.travelDestination = GameState.TransitionText;
      state.singleLevel = i;
      playSong(2);
    },
    x: (1 + (i % 3)) * 420,
    y: 170 * Math.floor(i / 3),
  });
}

[
  {
    text: ["Play full Game", "Nine world course"],
    v: () => {
      setTargetSpeed(15);
      playSong(2);
      state.travelDestination = GameState.TransitionText;
    },
  },
  {
    text: ["Stats &", "sharables"],
    v: () => (state.gameState = GameState.Stats),
    doublefat: true,
  },
  {},
].forEach((b, i) =>
  clickableBoxes.splice(i * 4, 0, {
    text: b.text,
    v: b.v,
    x: 0,
    y: 170 * i,
  })
);

// const addClickable = (c: clickableBox, f: string, side = -1) => {
//   clickableBoxes.push({
//     ...c,
//     w: 100,
//     //@ts-ignore
//     x: c.x + (c.w / 2 + 60) * side,
//     v: f,
//     text: [""],
//   });
// };

// addClickable(clickableBoxes[0], "1");
// addClickable(clickableBoxes[0], "2", 1);
// addClickable(clickableBoxes[1], "3");
// addClickable(clickableBoxes[1], "4", 1);

// export const drawButtons = (clickableBoxes, selected) => {
//   //ctx.translate(130, 500);
//   clickableBoxes.forEach((b, bI) => {
//     ctx.font = "bold 30px Arial";
//     ctx.textBaseline = "middle";
//     ctx.beginPath();
//     ctx.strokeStyle = "white";
//     const c = 50 + 50 * Math.sin(state.frame / 7);
//     ctx.fillStyle =
//       bI == selected ? `rgba(${c / 2},0,${c},1)` : "rgba(0,0,0,0.9)";

//     let { x, y } = b;
//     x += 130;
//     y += 500;

//     b.w = 400;
//     b.h = 150;

//     // x += b.absolute ? 0 : width / 2 - b.w / 2;

//     b.hitBox = { x, y, x0: x + b.w, y0: y + b.h };

//     ctx.rect(x, y, b.w, b.h);
//     ctx.fill();
//     ctx.stroke();

//     ctx.fillStyle = "white";
//     y += b.h / 2;

//     b.text.forEach((t, i) => {
//       if (i == 1 && !b.doublefat) {
//         ctx.font = "20px Arial";
//       }
//       ctx.fillText(
//         t,
//         x + b.w / 2 - ctx.measureText(t).width / 2,
//         y + i * 40 - 10 * b.text.length
//       );
//     });
//   });

//   ctx.strokeStyle = "white";
// };

// const getClickValue = (pos: vector2) =>
//   clickableBoxes.find(
//     (p) =>
//       pos.x > p.hitBox.x &&
//       pos.y > p.hitBox.y &&
//       pos.x < p.hitBox.x0 &&
//       pos.y < p.hitBox.y0
//   );

// const showDiv = (s: string) => {
//   const d = document.getElementById("d");
//   d.innerHTML = s;
// };

// showDiv("dass");
