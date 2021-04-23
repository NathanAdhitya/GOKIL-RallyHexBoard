import * as React from "react";
import {
	Grid,
	Paper,
	Typography,
	WithStyles,
	withStyles,
	Box,
} from "@material-ui/core";
import UIStyles from "./UIStyles";

interface InfoUIProps extends WithStyles<typeof UIStyles> {
	kelompok: number;
	points: number;
	currentRound: number;
}

class InfoUI extends React.PureComponent<InfoUIProps> {
	render() {
		const { kelompok, points, currentRound, classes } = this.props;
		return (
			<React.Fragment>
				<Grid item>
					<Paper className={classes.paper}>
						<Typography color="primary">Kelompok</Typography>
						<Typography variant="h3" color="primary">
							{kelompok}
						</Typography>
					</Paper>
				</Grid>
				<Grid item>
					<Paper className={classes.paper}>
						<Typography color="primary">Points</Typography>
						<Typography variant="h3" color="primary">
							{points}
						</Typography>
					</Paper>
				</Grid>
				<Grid item>
					<Paper className={classes.paper}>
						<Typography color="primary">Round</Typography>
						<Typography variant="h3" color="primary">
							{currentRound}
						</Typography>
					</Paper>
				</Grid>
			</React.Fragment>
		);
	}
}

export default withStyles(UIStyles)(InfoUI);
