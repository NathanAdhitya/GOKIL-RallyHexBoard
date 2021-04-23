import "./App";

/*import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { extendHex, defineGrid } from "honeycomb-grid";
import { biomeType, Tile } from "./lib/Tile";
import { UIColors } from "./config/Colors";

const Hex = extendHex({ size: 60 });
const Grid = defineGrid(Hex);
const RectGrid = Grid.rectangle({width: 60, height: 40});

const extraClamp = 512; // pixels

const app = new PIXI.Application({
  backgroundColor: UIColors.Background,
  resolution: window.devicePixelRatio || 1,
  resizeTo: window,
  antialias: true
});

document.body.appendChild(app.view);
window.addEventListener("resize", () => {
  viewport.resize(window.outerWidth, window.outerHeight), 0);
});

// create viewPort
const viewport = new Viewport({
  screenWidth: app.renderer.width,
  screenHeight: app.renderer.height,
  worldWidth: RectGrid.pointWidth(),
  worldHeight: RectGrid.pointHeight(),

  interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});

app.stage.addChild(viewport);
viewport.drag().pinch().wheel().decelerate({
  friction: 0.96,
  minSpeed: 0.01
}).clamp({
  top: -extraClamp,
  left: -extraClamp,
  right: viewport.worldWidth+extraClamp,
  bottom: viewport.worldHeight+extraClamp,
  underflow: "center",
}).clampZoom({
  maxWidth: viewport.worldWidth,
  maxHeight: viewport.worldHeight
});

window.vp = viewport;

RectGrid.forEach(function(hex){
  setTimeout(() => {
    const newTile = new Tile(hex, viewport);
    newTile.setBiome(biomeType.GRASS);
  }, 0);
});
*/

// // create a texture from an image path
// var texture = PIXI.Texture.from("src/grass.png");

// // Scale mode for pixelation
// texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

// function toHexagonPosition(p) {
//   var newP: any = {};
//   var xIdx = Math.round(p.x / (hexagonRadius * (3 / 2)));
//   newP.x = xIdx * (hexagonRadius * (3 / 2));
//   if (xIdx % 2) {
//     newP.y =
//       Math.floor(p.y / hexagonHeight) * hexagonHeight + hexagonHeight / 2;
//   } else {
//     newP.y = Math.round(p.y / hexagonHeight) * hexagonHeight;
//   }

//   return newP;
// }

// function createBunny(x, y) {
//   // create our little bunny friend..
//   var bunny = new PIXI.Sprite(texture);

//   var hexagon = new PIXI.Graphics();
//   hexagon.beginFill(0xff0000);

//   hexagon.drawPolygon([
//     -hexagonRadius,
//     0,
//     -hexagonRadius / 2,
//     hexagonHeight / 2,
//     hexagonRadius / 2,
//     hexagonHeight / 2,
//     hexagonRadius,
//     0,
//     hexagonRadius / 2,
//     -hexagonHeight / 2,
//     -hexagonRadius / 2,
//     -hexagonHeight / 2
//   ]);

//   hexagon.endFill();
//   hexagon.scale.set(0.95, 0.95);
//   hexagon.x = x;
//   hexagon.y = y;

//   /*var bunny = new PIXI.Graphics();
//   bunny.beginFill(0xff0000);

//   bunny.drawPolygon([
//     -hexagonRadius,
//     0,
//     -hexagonRadius / 2,
//     hexagonHeight / 2,
//     hexagonRadius / 2,
//     hexagonHeight / 2,
//     hexagonRadius,
//     0,
//     hexagonRadius / 2,
//     -hexagonHeight / 2,
//     -hexagonRadius / 2,
//     -hexagonHeight / 2
//     // -64, 128,             //First point
//     // 64, 128,              //Second point
//     // 0, 0
//   ]);*/

//   // bunny.endFill();
//   /*bunny.x = x;
//   bunny.y = y;*/

//   // var bunny = new PIXI.Circle(0,0, 60);
//   bunny.mask = hexagon;

//   // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
//   bunny.interactive = true;

//   // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
//   bunny.buttonMode = false;

//   // center the bunny's anchor point
//   bunny.anchor.set(0.5);

//   // make it a bit bigger, so it's easier to grab
//   // bunny.scale.set(3);

//   // setup events for mouse + touch using
//   // the pointer events

//   // move the sprite to its designated position
//   bunny.x = x;
//   bunny.y = y;

//   bunny.mouseover = function (mouseData) {
//     this.alpha = 0.5;
//   };

//   bunny.mouseout = function (mouseData) {
//     this.alpha = 1;
//   };

//   // add it to the stage
//   viewport.addChild(bunny);
//   viewport.addChild(hexagon);
//   // app.stage.addChild(hexagon);
// }

// for (var i = 0; i <= app.renderer.width; i += hexagonRadius * 2) {
//   for (var j = 0; j <= app.renderer.height; j += hexagonRadius * 2) {
//     var hexaP = toHexagonPosition({
//       x: j + 60,
//       y: i
//     });
//     createBunny(hexaP.x, hexaP.y);
//   }
// }
