import * as React from "react";
import {
	Box,
	Button,
	Typography,
	Avatar,
	Grid,
	IconButton,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { MenuChildProps, MenuOption } from "../MenuUI";

import SDIcon from "utils/gameboard/public/img/building/sd.svg";
import SMPIcon from "utils/gameboard/public/img/building/smp.svg";
import SMAIcon from "utils/gameboard/public/img/building/sma.svg";
import RoadIcon from "utils/gameboard/public/img/building/road.svg";
import {
	MapTile,
	TileBaseReward,
	TilePrices,
} from "utils/gameboard/config/MapTile";
import { ClientEvents } from "constants/ClientEvents";

export enum BuildSelection {
	SD = MapTile.SD,
	SMP = MapTile.SMP,
	SMA = MapTile.SMA,
	ROAD = MapTile.ROAD,
}

interface PurchaseState {
	selection: BuildSelection;
}

export default class PurchaseMenu extends React.PureComponent<
	MenuChildProps,
	PurchaseState
> {
	constructor(props: MenuChildProps) {
		super(props);
		this.state = {
			selection: BuildSelection.SD,
		};
	}

	onClick(to: BuildSelection) {
		this.setState({ selection: to });
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
						<Typography color="primary">Purchase</Typography>
					</Grid>
				</Grid>
				<Typography align="left">Choose, click on map, click place.</Typography>
				<br />
				<Button
					fullWidth
					style={{ justifyContent: "flex-start", textTransform: "none" }}
					variant={
						this.state.selection === BuildSelection.SD ? "contained" : undefined
					}
					onClick={() => this.onClick(BuildSelection.SD)}
				>
					<Box mr={1}>
						<Avatar variant="square" src={SDIcon} />
					</Box>
					<Typography variant="caption" align="left">
						SD <br /> Price: {TilePrices[MapTile.SD]} <br /> Production:{" "}
						{TileBaseReward[MapTile.SD]}
					</Typography>
				</Button>

				<Button
					fullWidth
					style={{ justifyContent: "flex-start", textTransform: "none" }}
					variant={
						this.state.selection === BuildSelection.SMP
							? "contained"
							: undefined
					}
					onClick={() => this.onClick(BuildSelection.SMP)}
				>
					<Box mr={1}>
						<Avatar variant="square" src={SMPIcon} />
					</Box>
					<Typography variant="caption" align="left">
						SMP <br /> Price: {TilePrices[MapTile.SMP]} <br /> Production:{" "}
						{TileBaseReward[MapTile.SMP]}
					</Typography>
				</Button>

				<Button
					fullWidth
					style={{ justifyContent: "flex-start", textTransform: "none" }}
					variant={
						this.state.selection === BuildSelection.SMA
							? "contained"
							: undefined
					}
					onClick={() => this.onClick(BuildSelection.SMA)}
				>
					<Box mr={1}>
						<Avatar variant="square" src={SMAIcon} />
					</Box>
					<Typography variant="caption" align="left">
						SMA <br /> Price: {TilePrices[MapTile.SMA]} <br /> Production:{" "}
						{TileBaseReward[MapTile.SMA]}
					</Typography>
				</Button>

				<Button
					fullWidth
					style={{ justifyContent: "flex-start", textTransform: "none" }}
					variant={
						this.state.selection === BuildSelection.ROAD
							? "contained"
							: undefined
					}
					onClick={() => this.onClick(BuildSelection.ROAD)}
				>
					<Box mr={1}>
						<Avatar variant="square" src={RoadIcon} />
					</Box>
					<Typography variant="caption" align="left">
						Road <br /> Price: {TilePrices[MapTile.ROAD]} <br /> Production:
						{" 0"}
						{TileBaseReward[MapTile.ROAD]}
					</Typography>
				</Button>
				<Button
					fullWidth
					variant="contained"
					color="primary"
					onClick={() => this.onPlace()}
				>
					<Typography variant="caption" align="left">
						Place
					</Typography>
				</Button>
			</React.Fragment>
		);
	}
}
