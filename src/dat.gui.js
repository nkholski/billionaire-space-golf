import dat from 'dat.gui';


import { Level, levels, state } from './state';



export default class setupGUI extends dat.GUI {
    
    // public plugin 
    // public settings;
    
    constructor() {
        super()
        this.settings = {
            levels: levels,
            active: false,

            // active: true,
            // rate: 1,
            // waterRate: 1,
            // lavaRate: 1,
            // resetRates: function () {
            //     this.plugin.resetRates();
            //     this.settings.rate = 1;
            //     this.settings.waterRate = 1;
            //     this.settings.lavaRate = 1;
            //     this.settings.leftMap.rate = 1;
            //     this.settings.leftMap.waterRate = 1;
            //     this.settings.leftMap.lavaRate = 1;
            //     this.settings.rightMap.rate = 1;
            //     this.settings.rightMap.waterRate = 1;
            //     this.fixGuiValues();
            // },
            // leftMap: {
            //     active: true,
            //     active0: true,
            //     active1: true,
            //     rate: 1,
            //     waterRate: 1,
            //     lavaRate: 1,
            //     resetRates: function () {
            //         this.plugin.resetRates(0);
            //         this.settings.leftMap.rate = 1;
            //         this.settings.leftMap.waterRate = 1;
            //         this.settings.leftMap.lavaRate = 1;
            //         this.fixGuiValues();
            //     },
            // },
            // rightMap: {
            //     active: true,
            //     waterRate: 1,
            // }
        };
        this.makeFolders();
    }

     makeFolders() {
    //     /// GLOBAL

    state.levels.forEach((l)=>{
            let folder = this.addFolder(l.name);
            // f.onChange((value) => {
            // console.log(value);
            //     // if (value) {
            //     //     this.plugin.resume();
            //     // } else {
            //     //     this.plugin.pause();
            //     // }
            // });
            l.planets.forEach((p,i) => {
                let pf = folder.addFolder(`planet ${i}`);



                pf.folder.add("planets[0].type", p.type);

            })


        });
       // f = folder.add(this.settings, 'rate', 0, 5);
    //     f.onChange((value) => {
    //         this.plugin.setRate(value);
    //     });
    //     f = folder.add(this.settings, 'waterRate', 0, 5);
    //     f.onChange((value) => {
    //         this.plugin.setRate(value, 1384);
    //     });
    //     f = folder.add(this.settings, 'lavaRate', 0, 5);
    //     f.onChange((value) => {
    //         this.plugin.setRate(value, 1412);
    //     });
    //     folder.add(this.settings, 'resetRates');

    //     folder.open();

    //     /// LEFT MAP
    //     let leftMap = this.addFolder('Left map');
    //     f = leftMap.add(this.settings.leftMap, 'active');
    //     f.onChange((value) => {
    //         if (value) {
    //             this.plugin.resume(null, 0);
    //         } else {
    //             this.plugin.pause(null, 0);
    //         }
    //     });
    //     f = leftMap.add(this.settings.leftMap, 'active0').name('Bottom layer');
    //     f.onChange((value) => {
    //         if (value) {
    //             this.plugin.resume(0, 0);
    //         } else {
    //             this.plugin.pause(0, 0);
    //         }
    //     });
    //     f = leftMap.add(this.settings.leftMap, 'active1').name('Top layer');
    //     f.onChange((value) => {
    //         if (value) {
    //             this.plugin.resume(1, 0);
    //         } else {
    //             this.plugin.pause(1, 0);
    //         }
    //     });
    //     f = leftMap.add(this.settings.leftMap, 'rate', 0, 5);
    //     f.onChange((value) => {
    //         this.plugin.setRate(value, null, 0);
    //     });
    //     f = leftMap.add(this.settings.leftMap, 'waterRate', 0, 5);
    //     f.onChange((value) => {
    //         this.plugin.setRate(value, 1384, 0);
    //     });
    //     f = leftMap.add(this.settings.leftMap, 'lavaRate', 0, 5);
    //     f.onChange((value) => {
    //         this.plugin.setRate(value, 1412, 0);
    //     });
    //     leftMap.add(this.settings.leftMap, 'resetRates');
    //     /*leftMap.add(this.settings.leftMap, 'resetRates');
    //     f = leftMap.add(this.settings.leftMap, 'active0').name('Bottom layer');
    //     f.onChange((value) =>  {
    //         if (value) {
    //             this.plugin.resume(0);
    //         }
    //         else {
    //             this.plugin.pause(0);
    //         }
    //     });
    //     f = leftMap.add(this.settings.leftMap, 'active1').name('Top layer');
    //     f.onChange((value) =>  {
    //         if (value) {
    //             this.plugin.resume(1);
    //         }
    //         else {
    //             this.plugin.pause(1);
    //         }
    //     });*/
    //     leftMap.open();

    //     let rightMap = this.addFolder('Right map');
    //     f = rightMap.add(this.settings.rightMap, 'active');
    //     f.onChange((value) => {
    //         if (value) {
    //             this.plugin.resume(null, 1);
    //         } else {
    //             this.plugin.pause(null, 1);
    //         }
    //     });

    //     f = rightMap.add(this.settings.rightMap, 'waterRate', 0, 5);
    //     f.onChange((value) => {
    //         this.plugin.setRate(value, 1384, 1);
    //     });
    //     rightMap.open();
    // }
    // fixGuiValues() {
    //     this.__folders["Global"].__controllers[1].updateDisplay();
    //     this.__folders["Global"].__controllers[2].updateDisplay();
    //     this.__folders["Global"].__controllers[3].updateDisplay();
    //     this.__folders["Left map"].__controllers[3].updateDisplay();
    //     this.__folders["Left map"].__controllers[4].updateDisplay();
    //     this.__folders["Left map"].__controllers[5].updateDisplay();
    //     this.__folders["Right map"].__controllers[1].updateDisplay();
    // }
     }
}
