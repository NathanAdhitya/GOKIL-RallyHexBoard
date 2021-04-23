import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
	createStyles({
		root: {
			height: "100vh",
			overflow: "hidden",
		},
		paper: {
			padding: theme.spacing(2),
			textAlign: "center",
			color: theme.palette.text.secondary,
		},
		control: {
			padding: theme.spacing(2),
		},
		fixedUI: {
			position: "fixed",
			top: theme.spacing(2),
			left: 0,
			width: "30%",
			maxWidth: "200px",
			maxHeight: "100%",
		},
	});
