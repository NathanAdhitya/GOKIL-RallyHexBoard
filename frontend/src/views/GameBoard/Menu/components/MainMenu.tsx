import * as React from "react";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { MenuChildProps, MenuOption } from "../MenuUI";

export default class MainMenu extends React.PureComponent<MenuChildProps> {
	render() {
		const { setMenu } = this.props;
		return (
			<React.Fragment>
				<Grid container direction="column">
					<Grid item xs={12}>
						<Typography color="primary">Main Menu</Typography>
					</Grid>
				</Grid>
				<Box mt={1}>
					<Button
						variant="contained"
						color="primary"
						size="small"
						fullWidth
						onClick={() => setMenu(MenuOption.INFORMATION)}
					>
						<Typography>How to play?</Typography>
					</Button>
				</Box>
				<Box mt={1}>
					<Button
						variant="contained"
						color="primary"
						size="small"
						fullWidth
						onClick={() => setMenu(MenuOption.PURCHASE)}
					>
						<Typography>Purchase</Typography>
					</Button>
				</Box>
				<Box mt={1}>
					<Button
						variant="contained"
						color="primary"
						size="small"
						fullWidth
						onClick={() => setMenu(MenuOption.RELOCATE)}
					>
						<Typography>Relocate</Typography>
					</Button>
				</Box>
				<Box mt={1}>
					<Button
						variant="contained"
						color="primary"
						size="small"
						fullWidth
						onClick={() => setMenu(MenuOption.GACHA)}
					>
						<Typography>Gacha</Typography>
					</Button>
				</Box>
			</React.Fragment>
		);
	}
}
