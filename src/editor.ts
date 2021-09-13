import { NewLevel, parseLevel } from "./levels";
import { Clamp } from "./helpers";
import { Level, LoadLevel, state } from "./state";
import setupGUI from "./dat.gui";
import { width, height, planetSizeMultiplier } from "./constants";

let win: Window;

let levelIndex = 0;

const openWindow = () => {
  if (!win || win.closed) {
    win = window.open("", "space_golf_editor", "resizable");
  }
  updateContent(levelIndex);
};

const makeRadTo255 = (v) => Math.round(v * (255 / (Math.PI * 2)));
const makeXto255 = (v) => Math.round(v * (255 / width));
const makeYto255 = (v) => Math.round(v * (255 / height));

let editedLevels: NewLevel[] = state.levels.map((l) => ({
  ...l,
  startAngle: makeRadTo255(l.startAngle),
  flagAngle: makeRadTo255(l.flagAngle),
  planets: l.planets.map((p) => ({
    ...p,
    position: {
      x: makeXto255(p.position.x),
      y: makeYto255(p.position.y),
    },
    size: p.size / planetSizeMultiplier,
  })),
  portals: l.portals.map((p) => ({
    x: makeXto255(p.x),
    y: makeYto255(p.y),
  })),
}));

// new setupGUI();

const updateContent = (i) => {
  //FLAGPLANET ÄR första PLANETEN!
  const level = editedLevels[i];
  //    win
  //    .document.write('<script>alert("I was Injected")</script>');
  let content = `

   <h1>${levelIndex}. ${level.name}</h1>
   <a onclick="prevPlanet()">Förra</a>
   <a onclick="nextPlanet()">Nästa</a>
   <a onclick="random()">Random</a>
   
   <br>
    <h2>Settings</h2>
    <div>StartAngle: <input  id='startAngle' value='${level.startAngle}' type="number" min="0" max="255" onblur='update()'></div>
    <div>FlagAngle: <input id='flagAngle' value='${level.flagAngle}' type="number" min="0" max="255" onblur='update()'></div>
    <div>Par: <input id='par' value='${level.par}' type="number" min="0" max="15" onblur='update()'></div>

    <h2>Planets</h2>
    <div id="script"></div>

    `;

  const methods = {
    update: () => {
      //@ts-ignore
      const startAngle = parseInt(document.getElementById("startAngle").value);
      //@ts-ignore
      const flagAngle = parseInt(document.getElementById("flagAngle").value);
      //@ts-ignore
      const par = parseInt(document.getElementById("par").value);
      const planets = document.getElementsByClassName("planet");
      const portals = document.getElementsByClassName("portal");

      const planetValues = [];
      //@ts-ignore
      for (let planet of planets) {
        let value: any = {};
        value.type = parseInt(planet.getElementsByClassName("ptype")[0].value);
        value.size = parseInt(planet.getElementsByClassName("size")[0].value);
        value.x = parseInt(planet.getElementsByClassName("x")[0].value);
        value.y = parseInt(planet.getElementsByClassName("y")[0].value);
        planetValues.push(value);
      }

      const portalValues = [];
      //@ts-ignore
      for (let portal of portals) {
        let value: any = {};
        value.x = parseInt(portal.getElementsByClassName("x")[0].value);
        value.y = parseInt(portal.getElementsByClassName("y")[0].value);
        portalValues.push(value);
      }

      window.opener.postMessage(
        {
          action: "update",
          data: {
            startAngle,
            flagAngle,
            par,
            planets: planetValues,
            portals: portalValues,
          },
        },
        "*"
      );
    },
    random: () => {
      window.opener.postMessage(
        {
          action: "random",
          data: 1,
        },
        "*"
      );
    },
    nextPlanet: () => {
      window.opener.postMessage(
        {
          action: "navigate",
          data: 1,
        },
        "*"
      );
    },
    prevPlanet: () => {
      window.opener.postMessage(
        {
          action: "navigate",
          data: -1,
        },
        "*"
      );
    },
    removePlanet: (i) => {
      window.opener.postMessage(
        {
          action: "removePlanet",
          data: i,
        },
        "*"
      );
    },
    removePortal: (i) => {
      window.opener.postMessage(
        {
          action: "removePortal",
          data: i,
        },
        "*"
      );
    },
    addPlanet: () => {
      window.opener.postMessage(
        {
          action: "addPlanet",
          data: 1,
        },
        "*"
      );
    },
    addPortal: () => {
      window.opener.postMessage(
        {
          action: "addPortal",
          data: 1,
        },
        "*"
      );
    },
  };

  level.planets.forEach((p, i) => {
    p.type = Clamp(p.type, 0, 3);
    content += `
        <div class="planet">
            <div>Type: 
            <select class="ptype" onchange='update()'>
                <option value="0"${
                  p.type == 0 ? " selected" : ""
                }>Normal</option>
                <option value="1"${p.type == 1 ? " selected" : ""}>Sand</option>
                <option value="2"${p.type == 2 ? " selected" : ""}>Lava</option>
                <option value="3"${
                  p.type == 3 ? " selected" : ""
                }>Negative</option>
            </select>
            <div>Size: <input class='size' value='${
              p.size
            }' type="number" min="0" max="15" onblur='update()'></div>
            <div>X: <input class='x' value='${
              p.position.x
            }' type="number" min="0" max="255" onblur='update()'> Y: <input class='y' value='${
      p.position.y
    }' type="number" min="0" max="255" onblur='update()'> </div>
            <button onclick='removePlanet(${i})'>Remove</button>
        </div>
        <hr>
        `;
  });

  content += `<button onclick='addPlanet()'>Add planet</button><br>

    <h2>Portals</h2>`;
  level.portals.forEach((p, i) => {
    content += `
        <div class="portal">
            <div>X: <input class='x' value='${
              p.x
            }' type="number" min="0" max="255" onblur='update()'> Y: <input class='y' value='${
      p.y
    }' type="number" min="0" max="255" onblur='update()'> </div>
        </div>
        ${
          i % 2 == 1
            ? ` <button onclick='removePortal(${i})'>Remove</button><hr>`
            : ""
        }`;
  });
  content += "<button onclick='addPortal()'>Add portal</button><br>";
  win.document.body.innerHTML = content;

  //console.log(methods.flagAngle.toString()); console.log(JSON.stringify(methods));

  let scripts = Object.keys(methods).reduce((a, m) => {
    return `${a}
        const ${m} = ${methods[m].toString()};`;
  }, "");

  const scr = document.createElement("script");
  scr.innerHTML = scripts;

  win.document.getElementById("script").appendChild(scr);
  // content+=`<script>const startAngle=${startAngle.toString()};</script>`

  //    win.document.body.appendChild(content);
  // const startAngle = (a) => console.log(a);

  //win.document.write("<script type='text/javascript'>alert('h1');</script>");

  // win.document.body.innerHTML = content;

  // const script = document.createElement("script");
  // script.innerHTML = 'startAngle = ' + startAngle.toString() + ';';
  // win.document.body.appendChild(script);
  //     win.document.body.appendChild(`    <script>
  //     const flagAngle = (a) => console.log(a);
  // </script>`)
  //const startAngle = (a) => console.log(a);

  // console.log('<script>const startAngle='+(startAngle.toString())+'</script>');
  // //const script = document.createElement("script");
  // //script.innerHTML = 'startAngle = ' + startAngle.toString() + ';';
  // win.document.write('<script>const startAngle='+(startAngle.toString())+'</script>');

  // win.document.write('<script>alert("I was Injected")</script>'); //     win.document.body.appendChild(`    <script>
};

const a = document.createElement("a");
a.onclick = openWindow;
a.innerText = "Editor";
document.body.appendChild(a);

const numFromHex = (hex: string, pos: number, lenght = 1, percentOf?: number) =>
  Math.round(
    parseInt(hex.substring(pos, pos + lenght), 16) *
      (percentOf ? percentOf / (lenght == 1 ? 15 : 255) : 1)
  );

// const parseLevel = (str:string) => {
//     const parts = str.split(",");
//     const index = 0;

//     const level:NewLevel = {
//         index,
//         name: parts[0],
//         startAngle: numFromHex(parts[1],0,2,360),
//         startPosition: {x:0, y:0},
//         flagAngle:numFromHex(parts[1],2,2,360),
//         flagPosition: {x:0, y:0},
//         par: numFromHex(parts[1],4),
//         planets: [],
//         portals: []
//     };

//     for(let i=4; i<parts[1].length; i+=6) {
//         level.planets.push(
//             {
//                 type: numFromHex(parts[1],i),
//                 size: numFromHex(parts[1],i+1),
//                 position: {
//                     x:  numFromHex(parts[1],i+2,2,width),
//                     y:  numFromHex(parts[1],i+4,2,height)
//                 },
//                 baseColor: "#F00"
//             }
//         )
//     }
//     for(let i=0; i<parts[2].length; i+=4) {
//         level.portals.push(
//             {
//                 x:  numFromHex(parts[2],i,2,width),
//                 y:  numFromHex(parts[2],i+2,2,height)
//             }
//         )
//     }
//     return level;
// }

const get256 = (i: number) => ("00" + i.toString(16)).slice(-2);
const get16 = (i: number) => i.toString(16);
const createStringFromLevel = (parsed: NewLevel = null) => {
  const l = parsed ?? editedLevels[levelIndex];
  let str = l.name + ",";

  //255*(a/(Math.PI*2))
  str += get256(l.startAngle);
  str += get256(l.flagAngle);
  str += get16(l.par);

  l.planets.forEach((p) => {
    str += get16(p.type);
    str += get16(p.size);
    str += get256(p.position.x);
    str += get256(p.position.y);
  });

  str += ",";

  l.portals.forEach((p) => {
    str += get256(p.x);
    str += get256(p.y);
  });

  return str;
};

window.addEventListener("message", function (event) {
  const { action, data } = event.data;
  let reloadWindow = true;
  const l = editedLevels[levelIndex];

  switch (action) {
    case "random":
      const pn = Math.round(3 + 4 * Math.random());
      const pt = 2 * Math.round(2 * Math.random());
      l.planets = [];
      for (let i = 0; i < pn; i++) {
        l.planets.push({
          type: Math.round(3 * Math.random()),
          size: Math.round(15 * Math.random()),
          position: {
            x: Math.round(255 * Math.random()),
            y: Math.round(255 * Math.random()),
          },
          baseColor: "red",
        });
      }

      l.portals = [];
      for (let i = 0; i < pt; i++) {
        l.portals.push({
          x: Math.round(255 * Math.random()),
          y: Math.round(255 * Math.random()),
        });
      }

      break;
    case "update":
      l.startAngle = data.startAngle; // * ((Math.PI*2)/255);
      //   console.log( data.startAngle * ((Math.PI*2)/255));

      l.flagAngle = data.flagAngle; // * ((Math.PI*2)/255);
      l.par = data.par;
      reloadWindow = false;
      l.planets.forEach((p, i) => {
        p.type = data.planets[i].type;
        p.size = data.planets[i].size;
        p.position = {
          x: data.planets[i].x,
          y: data.planets[i].y,
        };
      });

      l.portals.forEach((p, i) => {
        (p.x = data.portals[i].x), (p.y = data.portals[i].y);
      });
      break;

    case "navigate":
      levelIndex = Clamp(levelIndex + data, 0, editedLevels.length - 1);
      break;

    case "navigate":
      levelIndex = Clamp(levelIndex + data, 0, editedLevels.length - 1);
      // win.close();
      break;
    case "addPlanet":
      l.planets.push({
        type: 0,
        size: 5,
        position: { x: 127, y: 127 },
        baseColor: "", // auto
      });
      break;
    case "removePlanet":
      l.planets.length > 1 && l.planets.splice(data as number, 1);
      break;

    case "addPortal":
      l.portals.push({
        x: 127 + 20,
        y: 127,
      });
      l.portals.push({
        x: 127 - 20,
        y: 127,
      });
      break;
    case "removePortal":
      l.portals.length > 2 && l.portals.splice((data as number) - 1, 2);
      break;
  }

  let lvl = createStringFromLevel();

  console["log"](lvl);

  //debugger;
  state.levels[levelIndex] = parseLevel(lvl, levelIndex);
  LoadLevel(levelIndex);
  // console.log("new", editedLevels[levelIndex] );
  lvl = createStringFromLevel();

  //

  if (reloadWindow) {
    openWindow();
  }

  // if(event.data.event_id === 'my_cors_message'){
  //     console.log(event.data.data);
  // }
});

// const testParser = () => {
//     editedLevels.forEach((l,i) => {
//         if(i>0){
//             return;
//         }
//         debugger;
//         levelIndex = i;
//         editedLevels[i] = parseLevel("Andor,4078a2b,");
//         let str1 = createStringFromLevel();
//         // editedLevels[i] = parseLevel(str1); // Tvätta bort fel
//         // str1 = createStringFromLevel();
//         const parsed = parseLevel(str1); // Tvätta bort fel
//         const str2 = createStringFromLevel(parsed);

//         if(str1 !== str2){
//             console.log("----------Error: "+i);
//             console.log(editedLevels[i], parsed);
//             console.log(str1,str2);
//         }
//     })
// }

// editedLevels = [parseLevel("Andor,4078a2b,")];

// testParser();
