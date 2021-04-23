import * as React from "react";
import { Typography, IconButton, Grid } from "@material-ui/core";
import { MenuChildProps, MenuOption } from "../MenuUI";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { MapTile } from "utils/gameboard/config/MapTile";

interface TileInfoState {
	x: number;
	y: number;
	owner: number;
	type: MapTile;
	production: number;
	buildCost: number;
}

export default class InformationMenu extends React.PureComponent<
	MenuChildProps,
	TileInfoState
> {
	constructor(props: MenuChildProps) {
		super(props);
		this.state = {
			x: 0,
			y: 0,
			owner: 0,
			type: 0,
			production: 0,
			buildCost: 0,
		};
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
						<Typography color="primary">Tile Info</Typography>
					</Grid>
				</Grid>
				<div>
					<Typography align="left">
						Coordinates: {this.state.x},{this.state.y} <br />
						Owner: {this.state.owner}
						<br />
						Type: {this.state.type}
						<br />
						Total Multiplier:
						<br />
						Production: {this.state.production}% <br />
						Build Cost: {this.state.buildCost}% <br />
					</Typography>
					<br />
				</div>
			</React.Fragment>
		);
	}
}
