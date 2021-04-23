import * as React from "react";
import * as ReactDOM from "react-dom";

import jwt_decode from "jwt-decode";

import {
	Avatar,
	Box,
	Button,
	createMuiTheme,
	Grid,
	IconButton,
	Paper,
	ThemeProvider,
	Typography,
	WithStyles,
	withStyles,
} from "@material-ui/core";

import GameBoardView from "../../utils/gameboard/App";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import InfoUI from "./InfoUI";
import MenuUI from "./Menu/MenuUI";
import UIStyles from "./UIStyles";
import { authFetch, verifyToken } from "utils/authFetch";
import { ClientEvents } from "constants/ClientEvents";

const theme = createMuiTheme({
	typography: {
		fontFamily: ["Quicksand"].join(","),
	},
});

interface GameUIState {
	currentMenu: number;
	currentRound: number;
	tokenVerified: boolean;
	UserData: any;
	points: number;
}

class GameUI extends React.PureComponent<
	WithStyles<typeof UIStyles>,
	GameUIState
> {
	private pointsUpdateListener;
	private roundUpdateListener;

	constructor(props: any) {
		super(props);
		this.state = {
			currentMenu: 0,
			points: 0,
			tokenVerified: false,
			currentRound: 0,
			UserData: {},
		};
	}

	componentDidMount() {
		// check auth
		verifyToken().then(async () => {
			const userData = jwt_decode(localStorage.getItem("token"));
			const points = (await (await authFetch("getPoints")).json()).points;
			const round = (await (await authFetch("getRound")).json()).round;
			this.setState({
				tokenVerified: true,
				UserData: userData,
				points,
				currentRound: round,
			});
		});
		this.pointsUpdateListener = (e: CustomEvent) => {
			this.setState({ points: e.detail });
		};
		this.roundUpdateListener = (e: CustomEvent) => {
			this.setState({ currentRound: e.detail });
		};
		window.addEventListener(
			ClientEvents.POINTS_UPDATE,
			this.pointsUpdateListener,
		);
		window.addEventListener(
			ClientEvents.ROUND_UPDATE,
			this.roundUpdateListener,
		);
	}

	componentWillUnmount() {
		window.removeEventListener(
			ClientEvents.POINTS_UPDATE,
			this.pointsUpdateListener,
		);
		window.removeEventListener(
			ClientEvents.ROUND_UPDATE,
			this.roundUpdateListener,
		);
	}

	render() {
		const { classes } = this.props;
		return (
			<ThemeProvider theme={theme}>
				{this.state.tokenVerified ? (
					<div className={classes.root}>
						<Grid
							className={classes.fixedUI}
							direction={"column"}
							justify="flex-start"
							container
							spacing={2}
						>
							<InfoUI
								kelompok={this.state.UserData.team}
								points={this.state.points}
								currentRound={this.state.currentRound}
							/>
							<MenuUI />
						</Grid>
						<GameBoard />
					</div>
				) : (
					"Please wait, authenticating..."
				)}
			</ThemeProvider>
		);
	}
}

class GameBoard extends React.PureComponent {
	componentDidMount() {
		// eslint-disable-next-line
		ReactDOM.findDOMNode(this)?.appendChild(GameBoardView());
	}
	render() {
		return <div />;
	}
}
export default withStyles(UIStyles)(GameUI);
