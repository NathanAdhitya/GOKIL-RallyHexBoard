import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import GameBoard from "./views/GameBoard";
import LoginPage from "./views/Login";

import { OptionsObject, withSnackbar, WithSnackbarProps } from "notistack";
import { ClientEvents } from "constants/ClientEvents";

export interface notistackEvent {
	message: string;
	options?: OptionsObject;
}

// eslint-disable-next-line no-var
var notistackInit = false;

class App extends React.PureComponent<WithSnackbarProps> {
	constructor(props: WithSnackbarProps) {
		super(props);
		// notistack global
		if (!notistackInit) {
			window.addEventListener(
				ClientEvents.NOTISTACK,
				(e: CustomEvent<notistackEvent>) => {
					this.props.enqueueSnackbar(e.detail.message, e.detail.options);
				},
			);
			notistackInit = true;
		}
	}
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/">
						<LoginPage />
					</Route>
					<Route exact path="/game">
						<GameBoard />
					</Route>
					<Route path="*">
						<p>
							{`Oh hello mate, you're not supposed to be here. Blame Nathan or
							Matthew if you somehow came here by accident.`}
						</p>
					</Route>
				</Switch>
			</Router>
		);
	}
}

export default withSnackbar(App);
