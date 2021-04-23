export enum ClientEvents {
	// events coming from server
	POINTS_UPDATE = "pointsUpdate",
	ROUND_UPDATE = "roundUpdate",
	GACHA_UPDATE = "gachaUpdate",

	// events from client before to server
	BUILD = "gameBuild",
	RELOCATE = "gameRelocate",
	GACHA = "gacha",

	// events from client to client
	NOTISTACK = "notistack",
}
