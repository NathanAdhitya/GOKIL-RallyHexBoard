import * as React from "react";
import { Typography, IconButton, Grid } from "@material-ui/core";
import { MenuChildProps, MenuOption } from "../MenuUI";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

export default class InformationMenu extends React.PureComponent<MenuChildProps> {
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
						<Typography color="primary">How to play?</Typography>
					</Grid>
				</Grid>
				<div style={{ overflowY: "scroll", maxHeight: "80vh" }}>
					<Typography align="left">
						You can build on purple-colored and water tiles. Buildings/roads
						must be adjacent to an already existing building/road owned by your
						team. Buildings do not despawn.
					</Typography>
					<br />
					<Typography align="left">
						Buffs are marked yellow in the map, buildings adjacent to them
						receive a bonus. Debuffs are marked red in the map, buildings
						adjacent to them receive a debuff. Both of them have thicker icons.
						Buffs do not despawn.
					</Typography>
					<br />
					<Typography align="left">
						For every round cycle, you will gain points from the buildings that
						you have built, multiplied by the buffs sorrounding them.
					</Typography>
					<br />
					<Typography align="left" variant="body2">
						Objective: Get as many points as possible.
					</Typography>
				</div>
			</React.Fragment>
		);
	}
}
