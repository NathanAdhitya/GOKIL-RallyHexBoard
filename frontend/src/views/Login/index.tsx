import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import {
	createStyles,
	makeStyles,
	WithStyles,
	withStyles,
} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { LinearProgress } from "@material-ui/core";
import { ServerURL } from "constants/serverUrl";
import { notistackEvent } from "App";
import { ClientEvents } from "constants/ClientEvents";

const LoginStyles = (theme) =>
	createStyles({
		paper: {
			marginTop: theme.spacing(8),
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
		},
		avatar: {
			margin: theme.spacing(1),
			backgroundColor: theme.palette.secondary.main,
		},
		form: {
			width: "100%",
			marginTop: theme.spacing(1),
		},
		submit: {
			margin: theme.spacing(3, 0, 2),
		},
	});

interface LoginPageState {
	username: string;
	password: string;
	loading: boolean;
}

interface LoginPageProps extends WithStyles<typeof LoginStyles> {}

class LoginPage extends React.PureComponent<LoginPageProps, LoginPageState> {
	constructor(props: LoginPageProps) {
		super(props);
		this.state = {
			username: "",
			password: "",
			loading: false,
		};
	}
	handleLogin(event: any) {
		event.preventDefault();
		this.setState({ loading: true });
		console.log("yeet");
		fetch(ServerURL + "auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
			}),
		})
			.then(async (response) => {
				const parsed = await response.json();
				if (response.ok) {
					localStorage.setItem("token", parsed.token);
					window.location.href = "/game";
				} else {
					window.dispatchEvent(
						new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
							detail: { message: parsed.message },
						}),
					);
					this.setState({ loading: false });
				}
			})
			.then(() => {
				this.setState({ loading: false });
			})
			.catch(() => {
				window.dispatchEvent(
					new CustomEvent<notistackEvent>(ClientEvents.NOTISTACK, {
						detail: { message: "An error orcurred." },
					}),
				);
				this.setState({ loading: false });
			});
	}

	render() {
		const { classes } = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Welcome to GOKIL!
					</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoFocus
							value={this.state.username}
							onChange={(event) =>
								this.setState({ username: event.target.value })
							}
							disabled={this.state.loading}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							value={this.state.password}
							onChange={(event) =>
								this.setState({ password: event.target.value })
							}
							disabled={this.state.loading}
						/>

						{this.state.loading && <LinearProgress />}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={this.handleLogin.bind(this)}
							disabled={this.state.loading}
						>
							Sign In
						</Button>
					</form>
				</div>
			</Container>
		);
	}
}

export default withStyles(LoginStyles)(LoginPage);
