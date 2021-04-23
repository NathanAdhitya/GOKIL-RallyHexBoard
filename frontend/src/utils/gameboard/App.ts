import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { extendHex, defineGrid } from "honeycomb-grid";

// Import configs
import HexConfig from "./config/HexConfig";
import { UIColors } from "./config/Colors";
import { Tile } from "./lib/Tile";
import { ClientManager } from "./client/ClientManager";
import { BoardMap } from "utils/types/BoardMap";

// ---------------------------
// Main Code
// ---------------------------

// declare hex grid
const Hex = extendHex({ size: HexConfig.HexSize });
const Grid = defineGrid(Hex);
const RectGrid = Grid.rectangle({
	width: HexConfig.boardWidth,
	height: HexConfig.boardHeight,
});

// setup pixi
const app = new PIXI.Application({
	backgroundColor: UIColors.Background,
	resolution: window.devicePixelRatio || 1,
	width: window.innerWidth,
	height: window.innerHeight,
	antialias: true,
});

// create viewPort
const viewport = new Viewport({
	screenWidth: app.renderer.width,
	screenHeight: app.renderer.height,
	worldWidth: RectGrid.pointWidth(),
	worldHeight: RectGrid.pointHeight(),

	interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});

// add features to viewport
viewport
	.drag()
	.pinch()
	.wheel()
	.decelerate({
		friction: 0.96,
		minSpeed: 0.01,
	})
	.clamp({
		top: -HexConfig.clampOffset,
		left: -HexConfig.clampOffset,
		right: viewport.worldWidth + HexConfig.clampOffset,
		bottom: viewport.worldHeight + HexConfig.clampOffset,
		underflow: "center",
	})
	.clampZoom({
		maxWidth: viewport.worldWidth + HexConfig.clampOffset,
		maxHeight: viewport.worldHeight + HexConfig.clampOffset,
		minWidth: HexConfig.HexSize * 20,
	});

window.addEventListener("resize", () => {
	app.resizeTo = document.getElementById("root");
	viewport.resize(window.innerWidth, window.innerHeight);
});

// add viewport to pixi app and insert to html
app.stage.addChild(viewport);

// prettier-ignore
const currentTerrain = [
[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,0,0,0],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,0,0,0],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,0,0,0],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,0],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0],[null,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,0,0],[0,0,0,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,0,0],[0,null,0,null,0,0,null,null,null,null,null,1,1,1,null,1,1,1,null,null,null,null,null,0,0,0,null,null,null,null],[null,null,null,null,0,0,null,null,null,null,null,1,1,1,null,1,1,1,null,0,0,0,0,0,0,null,null,null,null,null],[null,null,null,null,null,0,0,0,null,null,null,null,1,null,null,null,1,null,null,0,0,0,0,null,null,null,null,null,null,null],[null,null,null,null,null,null,0,0,0,null,null,null,null,null,null,null,null,0,0,0,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,0,0,0,null,0,0,0,0,0,0,0,0,null,null,1,1,1,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,0,0,0,0,0,0,0,0,0,null,null,null,null,1,1,1,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,null,null,null,1,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,0,0,0,null,null,null,null,1,null,1,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,0,0,0,null,null,null,1,1,1,1,1,1,1,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,0,0,null,null,null,1,1,1,1,1,1,1,1,1,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,0,0,0,0,null,null,null,1,1,1,null,1,null,1,1,1,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,0,0,null,null,null,null,1,null,null,null,null,null,null,null,null,null,1,1,null,null,null,null,null,null,null],[null,null,null,null,0,0,0,null,null,null,1,1,1,null,null,null,null,null,null,null,1,1,1,null,null,null,null,null,null,null],[0,0,null,0,0,0,null,null,null,1,1,1,1,null,null,null,null,null,null,null,1,1,1,1,null,null,null,null,null,null],[0,0,0,0,0,null,null,null,null,1,1,1,1,null,null,null,null,null,null,null,1,1,1,1,null,null,null,null,null,null],[null,null,0,0,null,null,null,null,null,1,1,1,null,null,null,null,null,null,null,null,1,1,1,1,null,null,null,null,null,null],[null,null,null,0,0,null,null,null,1,1,1,1,1,null,null,null,null,null,null,null,1,1,1,1,null,null,null,null,null,null],[null,null,null,0,0,null,null,null,null,1,1,1,1,null,null,null,null,null,null,1,null,null,null,null,null,null,null,null,null,null],[null,null,null,0,0,0,null,null,null,null,null,null,null,1,null,1,1,1,1,1,1,1,null,null,null,null,null,null,null,null],[null,null,null,null,0,0,null,null,null,null,null,1,1,1,1,1,1,1,1,1,1,1,null,null,null,null,null,null,null,null],[null,null,null,null,0,0,0,null,null,null,null,null,1,1,1,1,1,1,1,null,1,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,0,0,null,null,null,null,null,null,1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,1,null,null,null,null],[null,null,null,null,null,null,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,1,1,1,null,null,null],[null,null,null,null,null,null,null,0,0,0,null,0,null,null,null,0,null,null,null,null,null,null,null,null,1,1,1,null,null,null],[null,null,null,null,null,null,null,null,0,0,0,0,0,0,0,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,0,null,0,0,0,null,0,0,0,0,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,0,0,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,null,0,0,0,0,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,0,null,null,null,null,0,0,0,0,null,null,null,null],[null,1,null,null,null,null,null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,0,0,null,null,null,0],[1,1,1,null,null,null,null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,0,0,0,0,0,0],[1,1,1,1,null,null,null,null,null,null,null,null,null,null,0,0,0,null,null,null,null,null,null,null,null,null,0,0,0,null],[null,1,1,1,1,null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,1,1,1,1,null,null,null,null,null,null,null,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,1,1,null,null,null,null,null,null,null,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
];

// create tiles on board
const boardGrid: Tile[][] = [];

var hasInitYet = false;

function startTheGame() {
	if (!hasInitYet) {
		const gameClient = new ClientManager(app, boardGrid);
		gameClient.getTerrainData().then((data) => {
			RectGrid.forEach(function (hex) {
				// create tiles async for poor laptops
				//setTimeout(() => {
				if (data[hex.x] && data[hex.x][hex.y]) {
					const newTile = new Tile(hex, app.renderer);
					newTile.renderToContainer(viewport);
					newTile.landType = data[hex.x][hex.y].landType;
					if (data[hex.x][hex.y].landOwner)
						newTile.owner = data[hex.x][hex.y].landOwner;
					boardGrid[hex.x] = boardGrid[hex.x] ?? [];
					boardGrid[hex.x][hex.y] = newTile;
					//console.log(data[hex.y][hex.x].landType);
					/*if (
                currentTerrain[hex.x] &&
                currentTerrain[hex.x][hex.y] !== null
            ) {
                const newTile = new TerrainTile(hex, app.renderer);
                newTile.renderToContainer(viewport);
                newTile.terrainType = currentTerrain[hex.x][hex.y];*/
				} else {
					const newTile = new Tile(hex, app.renderer);
					newTile.renderToContainer(viewport);
					boardGrid[hex.x] = boardGrid[hex.x] ?? [];
					boardGrid[hex.x][hex.y] = newTile;
				}
				/*const newTile =
                data[hex.y] && data[hex.y][hex.y] === null
                    ? new BuildableTile(hex, app.renderer)
                    : new TerrainTile(hex, app.renderer);
            boardGrid[hex.x] = boardGrid[hex.y] || [];
            boardGrid[hex.x][hex.y] = newTile;
            newTile.renderToContainer(viewport);
            newTile.terrainType = data[hex.x] && data[hex.x][hex.y].landType;*/
				//}, 0);
			});
		});
		hasInitYet = true;
		// listen to socket builds and stuff

		gameClient.io.on("build", (data: BoardMap) => {
			const { x, y, landType, landOwner } = data;
			console.log(boardGrid);
			console.log(x, y);
			boardGrid[x][y].landType = landType;
			boardGrid[x][y].owner = landOwner;
		});
	}
	app.view.oncontextmenu = () => false;

	return app.view;
}

// @ts-expect-error
window.boardGrid = boardGrid;

// debugging purposes
if (process.env.NODE_ENV === "development") {
	//@ts-expect-error
	window.PIXIapp = app;
	// @ts-expect-error
	window.appViewport = viewport;
}

export default startTheGame;
