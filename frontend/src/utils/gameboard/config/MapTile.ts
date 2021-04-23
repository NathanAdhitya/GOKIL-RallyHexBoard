// client and server should have this data.

export const BoardDimensions = {
	width: 50,
	height: 30,
};

export enum MapTile {
	WATER = 0,
	MOUNTAIN = 1,
	SD = 2,
	SMP = 3,
	SMA = 4,
	ROAD = 5,
	PRODUCTION_BUFF = 6,
	DISCOUNT_BUFF = 7,
	PRODUCTION_DEBUFF = 8,
	COST_DEBUFF = 9,
	_LENGTH,
}

export const TilePrices = {
	[MapTile.SD]: 100,
	[MapTile.SMP]: 200,
	[MapTile.SMA]: 350,
	[MapTile.ROAD]: 25,
};
export const TileBaseReward = {
	[MapTile.SD]: 50,
	[MapTile.SMP]: 100,
	[MapTile.SMA]: 200,
};

export const GachaPrice = 300;

export const TileBonusMultiplier = {
	// [production?, building?]

	/** built adjacent to water :) */
	[MapTile.WATER]: [1.05],
	[MapTile.PRODUCTION_BUFF]: [1.5],
	[MapTile.DISCOUNT_BUFF]: [null, 0.5],
	[MapTile.PRODUCTION_DEBUFF]: [0.75],
	[MapTile.COST_DEBUFF]: [null, 1.5],
};
