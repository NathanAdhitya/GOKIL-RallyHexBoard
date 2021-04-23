import * as React from "react";
import { Box, Button, Grid, IconButton, Typography } from "@material-ui/core";
import { MenuChildProps, MenuOption } from "../MenuUI";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { TilePrices, MapTile } from "utils/gameboard/config/MapTile";
import { ClientEvents } from "constants/ClientEvents";

export default class RelocateMenu extends React.PureComponent<MenuChildProps> {
	onRelocate() {
		window.dispatchEvent(new CustomEvent(ClientEvents.RELOCATE));
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
						<Typography color="primary">Relocate</Typography>
					</Grid>
				</Grid>
				<Typography align="left">Build a road wherever you want!</Typography>
				<Typography align="left">Select a tile, and press relocate.</Typography>
				<Typography align="left">
					This costs {TilePrices[MapTile.ROAD] * 8} points.
				</Typography>
				<Box mt={2}>
					<Button
						variant="contained"
						color="primary"
						size="small"
						fullWidth
						onClick={() => this.onRelocate()}
					>
						<Typography>Relocate</Typography>
					</Button>
				</Box>
			</React.Fragment>
		);
	}
}
