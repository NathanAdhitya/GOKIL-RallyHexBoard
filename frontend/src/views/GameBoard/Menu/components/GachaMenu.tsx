import * as React from "react";
import {
	Box,
	Button,
	Typography,
	IconButton,
	Grid,
	Divider,
	CircularProgress,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { MenuChildProps, MenuOption } from "../MenuUI";
import { GachaPrice, MapTile } from "utils/gameboard/config/MapTile";
import { ClientEvents } from "constants/ClientEvents";
import { authFetch } from "utils/authFetch";

export enum BuildSelection {
	COST_DEBUFF = MapTile.COST_DEBUFF,
	DISCOUNT_BUFF = MapTile.DISCOUNT_BUFF,
	PRODUCTION_BUFF = MapTile.PRODUCTION_BUFF,
	PRODUCTION_DEBUFF = MapTile.PRODUCTION_DEBUFF,
}

interface GachaState {
	selection: BuildSelection;
	gachaDisabled: boolean;
	inventoryLoaded: boolean;
	inventory: GachaInventory;
}

export interface GachaInventory {
	[MapTile.PRODUCTION_BUFF]?: number;
	[MapTile.PRODUCTION_DEBUFF]?: number;

	[MapTile.DISCOUNT_BUFF]?: number;
	[MapTile.COST_DEBUFF]?: number;
}

export default class GachaMenu extends React.PureComponent<
	MenuChildProps,
	GachaState
> {
	private disabledTimeout;
	private updateListener;

	constructor(props: MenuChildProps) {
		super(props);
		this.state = {
			selection: BuildSelection.COST_DEBUFF,
			gachaDisabled: false,
			inventory: {},
			inventoryLoaded: false,
		};
	}

	onClick(to: BuildSelection) {
		this.setState({ selection: to });
	}

	onGacha() {
		this.setState({ gachaDisabled: true });
		const sT = this.setState.bind(this);
		window.dispatchEvent(new CustomEvent(ClientEvents.GACHA));
		this.disabledTimeout = window.setTimeout(function () {
			sT({ gachaDisabled: false });
		}, 2000);
	}

	componentDidMount() {
		// load the gacha inventory
		authFetch("getInventory")
			.then((resp) => resp.json())
			.then((data) => {
				this.setState({
					inventory: data.inventory ?? {},
					inventoryLoaded: true,
				});
			});
		window.addEventListener(ClientEvents.GACHA_UPDATE, (e: CustomEvent) => {
			this.setState({
				inventory: e.detail,
			});
		});
	}

	componentWillUnmount() {
		window.clearTimeout(this.disabledTimeout);
	}

	onPlace() {
		window.dispatchEvent(
			new CustomEvent(ClientEvents.BUILD, {
				detail: this.state.selection,
			}),
		);
	}

	render() {
		const { setMenu } = this.props;
		const { selection, gachaDisabled, inventory, inventoryLoaded } = this.state;

		return (
			<React.Fragment>
				<Grid container direction={"row"} spacing={1}>
					<Grid item xs={2}>
						<IconButton
							aria-label="arrowback"
							size="small"
							onClick={() => setMenu(MenuOption.MAIN_MENU)}
						>
							<ArrowBackIcon color="primary" />
						</IconButton>
					</Grid>
					<Grid item xs={9}>
						<Typography color="primary">Gacha</Typography>
					</Grid>
				</Grid>
				<Typography align="left">
					Gamble {GachaPrice} points to obtain a random buff/debuff that you can
					place anywhere on the map!
				</Typography>
				<Box mt={1}>
					<Button
						variant="contained"
						color="primary"
						size="small"
						fullWidth
						disabled={gachaDisabled}
						onClick={this.onGacha.bind(this)}
					>
						<Typography>Gacha!</Typography>
					</Button>
				</Box>
				<Divider />
				<Box mt={1}>
					<Typography align="center">Inventory:</Typography>
					{inventoryLoaded ? (
						<React.Fragment>
							<Button
								variant={
									selection === BuildSelection.PRODUCTION_BUFF
										? "contained"
										: undefined
								}
								onClick={() => this.onClick(BuildSelection.PRODUCTION_BUFF)}
							>
								{(inventory[MapTile.PRODUCTION_BUFF] ?? 0).toString()}x 50%
								Production Increase Buff
							</Button>
							<Button
								variant={
									selection === BuildSelection.DISCOUNT_BUFF
										? "contained"
										: undefined
								}
								onClick={() => this.onClick(BuildSelection.DISCOUNT_BUFF)}
							>
								{(inventory[MapTile.DISCOUNT_BUFF] ?? 0).toString()}x 50% Build
								Discount Buff
							</Button>
							<Button
								variant={
									selection === BuildSelection.COST_DEBUFF
										? "contained"
										: undefined
								}
								onClick={() => this.onClick(BuildSelection.COST_DEBUFF)}
							>
								{(inventory[MapTile.COST_DEBUFF] ?? 0).toString()}x 50% Build
								Cost Increase Debuff
							</Button>
							<Button
								variant={
									selection === BuildSelection.PRODUCTION_DEBUFF
										? "contained"
										: undefined
								}
								onClick={() => this.onClick(BuildSelection.PRODUCTION_DEBUFF)}
							>
								{(inventory[MapTile.PRODUCTION_DEBUFF] ?? 0).toString()}x 50%
								Production Decrease Debuff
							</Button>
						</React.Fragment>
					) : (
						<CircularProgress />
					)}
				</Box>
				<Box mt={1}>
					<Button
						variant="contained"
						color="primary"
						size="small"
						fullWidth
						onClick={this.onPlace.bind(this)}
					>
						<Typography>Place</Typography>
					</Button>
				</Box>
			</React.Fragment>
		);
	}
}
