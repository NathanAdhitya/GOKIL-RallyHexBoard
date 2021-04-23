import * as PIXI from "pixi.js";
import Honeycomb from "honeycomb-grid";
import { TeamColors, UIColors } from "../config/Colors";
import { MapTile } from "../config/MapTile";
import { MapTileSpriteProps } from "../config/MapTileSprites";
import { Viewport } from "pixi-viewport";

//const texture = PIXI.Texture.from(biomeTexture[biomeType.GRASS]);
//texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

// create hexagon texture to improve performance
// TODO: Make it more versatile, but really, it's not the highest priority.
var hexagonTexture: PIXI.Texture;
function getHexagon(
	hex: Honeycomb.Hex<{ size: number }>,
	renderer: PIXI.Renderer | PIXI.AbstractRenderer,
): PIXI.Texture {
	if (hexagonTexture) return hexagonTexture;
	const hexagon = new PIXI.Graphics();

	hexagon.beginFill(0xffffff);

	const corners = hex.corners();
	hexagon.drawPolygon([
		corners[0].x,
		corners[0].y,

		corners[1].x,
		corners[1].y,

		corners[2].x,
		corners[2].y,

		corners[3].x,
		corners[3].y,

		corners[4].x,
		corners[4].y,

		corners[5].x,
		corners[5].y,
	]);

	hexagon.endFill();
	hexagon.scale.set(0.95, 0.95);

	hexagonTexture = renderer.generateTexture(
		hexagon,
		PIXI.SCALE_MODES.LINEAR,
		2,
	);
	return hexagonTexture;
}

export class Tile {
	/** coordinates */
	public readonly x: number;
	public readonly y: number;

	/** land graphics */
	public graphics: PIXI.Sprite;
	public sprite: PIXI.Sprite;
	public renderer: PIXI.Renderer | PIXI.AbstractRenderer;
	public readonly hex: Honeycomb.Hex<{ size: number }>;

	/** land properties */
	protected _landType?: MapTile;
	protected _owner?: number;

	constructor(
		hex: Honeycomb.Hex<{ size: number }>,
		renderer: PIXI.Renderer | PIXI.AbstractRenderer,
	) {
		const { x, y } = hex;
		this.x = x;
		this.y = y;

		this.hex = hex;
		this.renderer = renderer;

		// initialize the graphics object.
		this.graphics = new PIXI.Sprite();
		this.sprite = new PIXI.Sprite();
		this.initGraphics();
	}

	// land type
	get landType(): MapTile | undefined {
		return this._landType;
	}

	set landType(type: MapTile | undefined) {
		this._landType = type;
		if (type === null || type === undefined) {
			// @ts-ignore
			this.sprite.texture = undefined;
			this.graphics.tint = UIColors.EmptyTile;
		} else {
			if (MapTileSpriteProps[type][3])
				this.sprite.scale.set(MapTileSpriteProps[type][3]);
			this.sprite.texture = MapTileSpriteProps[type][0];
			this.sprite.alpha = MapTileSpriteProps[type][2];

			this.graphics.tint =
				MapTileSpriteProps[type][1] ??
				(this._owner !== undefined
					? TeamColors[this._owner]
					: UIColors.EmptyTile);
		}
	}

	// owner
	get owner(): number | undefined {
		return this._owner;
	}

	set owner(newOwner: number | undefined) {
		this._owner = newOwner;
		if (MapTileSpriteProps[this._landType][1]) return;
		if (newOwner === null || newOwner === undefined) {
			this.graphics.tint = UIColors.EmptyTile;
		} else {
			this.graphics.tint = TeamColors[newOwner] ?? UIColors.EmptyTile;
		}
	}

	// mouse events
	public onMouseOver(event) {
		// @ts-expect-error
		if (window.selectedTile === this) {
			this.graphics.alpha = 0.1;
		} else {
			this.graphics.alpha = 0.8;
		}
	}

	public onMouseOut(event) {
		// @ts-expect-error
		if (window.selectedTile === this) {
			this.graphics.alpha = 0.3;
		} else {
			this.graphics.alpha = 1;
		}
	}

	public onClick() {
		// @ts-expect-error
		if (window.selectedTile) window.selectedTile.graphics.alpha = 1;
		// @ts-expect-error
		window.selectedTile = this;
		this.graphics.alpha = 0.3;
	}

	public addInteractions() {
		const hexagon = this.graphics;
		hexagon.interactive = true;

		// @ts-expect-error
		hexagon.mouseover = this.onMouseOver.bind(this);

		// @ts-expect-error
		hexagon.mouseout = this.onMouseOut.bind(this);

		hexagon.on("click", this.onClick.bind(this));
	}

	private initGraphics() {
		/*this.graphics = new PIXI.Graphics();
        const { x, y } = hex.toPoint();

        const hexagon = this.graphics;
        hexagon.beginFill(0xffffff);
        hexagon.tint = UIColors.EmptyTile;

        const corners = hex.corners();
        hexagon.drawPolygon([
            corners[0].x,
            corners[0].y,

            corners[1].x,
            corners[1].y,

            corners[2].x,
            corners[2].y,

            corners[3].x,
            corners[3].y,

            corners[4].x,
            corners[4].y,

            corners[5].x,
            corners[5].y,
        ]);

        hexagon.endFill();
        hexagon.scale.set(0.95, 0.95);
        hexagon.x = x;
        hexagon.y = y;*/

		const hex = this.hex;
		const { x, y } = hex.toPoint();

		this.graphics = new PIXI.Sprite(getHexagon(this.hex, this.renderer));
		this.graphics.x = x;
		this.graphics.y = y;
		this.graphics.tint = UIColors.EmptyTile;
	}

	/** Generate the things inside the hexagon */
	protected generateSprite() {
		// render the sprite
		const sprite = new PIXI.Sprite();

		// position
		sprite.anchor.set(0.5);
		sprite.x = this.graphics.width / 2 - 2;
		sprite.y = this.graphics.height / 2 - 3;

		// set scale
		sprite.scale.set(0.45);

		this.sprite = sprite;
	}

	public renderToContainer(stage: Viewport | PIXI.Container) {
		this.generateSprite();
		stage.addChild(this.graphics);
		this.graphics.addChild(this.sprite);

		this.addInteractions();
	}
}
