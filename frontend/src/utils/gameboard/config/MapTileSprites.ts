// client-only pixi
import * as PIXI from "pixi.js";
import SDTexture from "../public/img/building/sd.svg";
import SMPTexture from "../public/img/building/smp.svg";
import SMATexture from "../public/img/building/sma.svg";
import ROADTexture from "../public/img/building/road.svg";
import PRODUCTIONBUFFTexture from "../public/img/building/buffProduction.svg";
import DISCOUNTBUFFTexture from "../public/img/building/buffDiscount.svg";

import WaterTexture from "../public/img/terrain/water.svg";
import MountainTexture from "../public/img/terrain/mountain.svg";

import { MapTile } from "./MapTile";

export const MapTileSpriteProps = {
	[MapTile.WATER]: [PIXI.Texture.from(WaterTexture), 0x27d7d8, 0.4],
	[MapTile.MOUNTAIN]: [PIXI.Texture.from(MountainTexture), 0xe5e5e5, 1],
	[MapTile.SD]: [PIXI.Texture.from(SDTexture), null, 1, 0.125],
	[MapTile.SMP]: [PIXI.Texture.from(SMPTexture), null, 1, 0.125],
	[MapTile.SMA]: [PIXI.Texture.from(SMATexture), null, 1, 0.125],
	[MapTile.ROAD]: [PIXI.Texture.from(ROADTexture), null, 1, 0.4],
	[MapTile.PRODUCTION_BUFF]: [
		PIXI.Texture.from(PRODUCTIONBUFFTexture),
		0xffd700,
		1,
		0.125,
	],
	[MapTile.DISCOUNT_BUFF]: [
		PIXI.Texture.from(DISCOUNTBUFFTexture),
		0xffd700,
		1,
		0.125,
	],
	[MapTile.PRODUCTION_DEBUFF]: [
		PIXI.Texture.from(PRODUCTIONBUFFTexture),
		0x404040,
		1,
		0.125,
	],
	[MapTile.COST_DEBUFF]: [
		PIXI.Texture.from(DISCOUNTBUFFTexture),
		0x404040,
		1,
		0.125,
	],
};
