import * as SocketIO from "socket.io-client";
import * as PIXI from "pixi.js";
import { Tile } from "../lib/Tile";
import { BoardMap } from "../../types/BoardMap";
import { MapTile } from "../config/MapTile";
import { ServerURL } from "constants/serverUrl";
import { authFetch } from "utils/authFetch";
import { Socket } from "dgram";
import { notistackEvent } from "App";
import { BoardGameEvent } from "constants/boardgame";
import { ClientEvents } from "constants/ClientEvents";

export enum BuildFailReasons {
	NOT_BUILDABLE,
	NO_NEARBY,
	INSUFFICIENT_POINTS,
	TILE_OCCUPIED,
	INVALID_COORDINATES,
}

export const BuildFailMessages = {
	[BuildFailReasons.NOT_BUILDABLE]: "You cannot build that",
	[BuildFailReasons.NO_NEARBY]: "You don't have an adjacent building",
	[BuildFailReasons.INSUFFICIENT_POINTS]: "Not enough points",
	[BuildFailReasons.TILE_OCCUPIED]: "Tile is occupied",
	[BuildFailReasons.INVALID_COORDINATES]:
		"Server error, please contact the committee",
};

/** Manages socket.io connections and updates the game board */
export class ClientManager {
	public gameApp: PIXI.Application;
	public gameTiles: Array<Array<Tile>>;

	public pingCounter: PIXI.Text;
	public pingCounterBg: PIXI.Sprite;

	public io: SocketIO.Socket;

	constructor(gameApp: PIXI.Application, gameTiles: Array<Array<Tile>>) {
		this.io = SocketIO.io(ServerURL, {
			auth: { token: localStorage.getItem("token") },
		});
		this.gameApp = gameApp;
		this.gameTiles = gameTiles;

		// create ping text
		this.pingCounter = new PIXI.Text("Connecting...");
		this.pingCounter.anchor.set(1);
		this.pingCounter.x = window.innerWidth;
		this.pingCounter.y = window.innerHeight;

		this.pingCounterBg = new PIXI.Sprite(PIXI.Texture.WHITE);
		this.pingCounterBg.tint = 0x000000;
		this.pingCounterBg.alpha = 0.2;

		this.pingCounterBg.anchor.set(1);
		this.pingCounterBg.x = window.innerWidth;
		this.pingCounterBg.y = window.innerHeight;

		this.pingCounter.style = {
			fontSize: 12,
			padding: 0,
			fill: 0xffffff,
		};

		window.addEventListener("resize", () => {
			this.pingCounter.x = window.innerWidth;
			this.pingCounter.y = window.innerHeight;
			this.pingCounterBg.width = this.pingCounter.width;
			this.pingCounterBg.height = this.pingCounter.height;
			this.pingCounterBg.x = window.innerWidth;
			this.pingCounterBg.y = window.innerHeight;
		});

		this.gameApp.stage.addChild(this.pingCounterBg);
		this.gameApp.stage.addChild(this.pingCounter);

		this.pingCounterBg.width = this.pingCounter.width;
		this.pingCounterBg.height = this.pingCounter.height;

		this.listen();
		this.connect();
	}

	private listen() {
		this.io.on("connect", () => {
			this.pingCounter.text = `Connected`;
		});

		setInterval(() => {
			const start = Date.now();

			// volatile, so the packet will be discarded if the socket is not connected
			this.io.volatile.emit("ping", () => {
				const latency = Date.now() - start;
				this.pingCounter.text = `Ping: ${latency}ms`;
			});
		}, 5000);

		this.io.on(BoardGameEvent.BALANCE_UPDATE, () => {
			this.pingCounter.text = `Disconnected`;
		});

		this.io.on(BoardGameEvent.BALANCE_UPDATE, (newPoints: number) => {
			window.dispatchEvent(
				new CustomEvent(ClientEvents.POINTS_UPDATE, { detail: newPoints }),
			);
		});

		this.io.on(
			BoardGameEvent.NEW_ROUND,
			(newPoints: number, newRound: number) => {
				window.dispatchEvent(
					new CustomEvent(ClientEvents.POINTS_UPDATE, { detail: newPoints }),
				);
				window.dispatchEvent(
					new CustomEvent(ClientEvents.ROUND_UPDATE, { detail: newRound }),
				);
			},
		);

		window.addEventListener(ClientEvents.GACHA, (e: CustomEvent) => {
			this.io.emit(BoardGameEvent.GACHA, (result, endResult) => {
				if (result === 0) {
					window.dispatchEvent(
						new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
							detail: { message: "Insufficient funds" },
						}),
					);
				} else {
					window.dispatchEvent(
						new CustomEvent(ClientEvents.GACHA_UPDATE, {
							detail: endResult,
						}),
					);
					window.dispatchEvent(
						new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
							detail: {
								message: "You earned something, check your inventory.",
							},
						}),
					);
				}
			});
		});

		window.addEventListener(ClientEvents.BUILD, (e: CustomEvent) => {
			// @ts-expect-error
			if (!window.selectedTile)
				return window.dispatchEvent(
					new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
						detail: { message: "You haven't selected a tile" },
					}),
				);
			this.io.emit(
				BoardGameEvent.BUILD,
				{
					landType: e.detail,
					// @ts-expect-error
					x: window.selectedTile.x,
					// @ts-expect-error
					y: window.selectedTile.y,
				},
				(status) => {
					if (status instanceof Array) {
						window.dispatchEvent(
							new CustomEvent(ClientEvents.POINTS_UPDATE, {
								detail: status[1],
							}),
						);
						window.dispatchEvent(
							new CustomEvent(ClientEvents.GACHA_UPDATE, {
								detail: status[2],
							}),
						);
					} else {
						window.dispatchEvent(
							new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
								detail: { message: BuildFailMessages[status] },
							}),
						);
					}
				},
			);

			window.dispatchEvent(
				new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
					detail: { message: "Build request sent." },
				}),
			);
		});

		window.addEventListener(ClientEvents.RELOCATE, (e: CustomEvent) => {
			// @ts-expect-error
			if (!window.selectedTile)
				return window.dispatchEvent(
					new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
						detail: { message: "You haven't selected a tile" },
					}),
				);
			this.io.emit(
				BoardGameEvent.RELOCATE,
				{
					// @ts-expect-error
					x: window.selectedTile.x,
					// @ts-expect-error
					y: window.selectedTile.y,
				},
				(status) => {
					if (status instanceof Array) {
						window.dispatchEvent(
							new CustomEvent(ClientEvents.POINTS_UPDATE, {
								detail: status[1],
							}),
						);
					} else {
						window.dispatchEvent(
							new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
								detail: { message: BuildFailMessages[status] },
							}),
						);
					}
				},
			);
			window.dispatchEvent(
				new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
					detail: { message: "Relocate request sent." },
				}),
			);
		});
	}

	async getTerrainData(): Promise<BoardMap[][]> {
		// get readable stream
		const initTerrainData: BoardMap[][] = [];
		const map: BoardMap[] = await authFetch("getMap").then((data) =>
			data.json(),
		);

		map.forEach((tileData) => {
			initTerrainData[tileData.x] = initTerrainData[tileData.x] ?? [];
			initTerrainData[tileData.x][tileData.y] = tileData;
		});
		return initTerrainData;
	}

	private connect() {
		this.io.connect();
	}
}
