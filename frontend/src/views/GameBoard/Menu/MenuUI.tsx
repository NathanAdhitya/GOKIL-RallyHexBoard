import * as React from "react";
import { Grid, Paper, WithStyles, withStyles } from "@material-ui/core";
import UIStyles from "../UIStyles";
import MainMenu from "./components/MainMenu";
import InformationMenu from "./components/InformationMenu";
import PurchaseMenu from "./components/PurchaseMenu";
import GachaMenu from "./components/GachaMenu";
import RelocateMenu from "./components/RelocateMenu";
import TileInfoMenu from "./components/TileInfoMenu";
import clsx from "clsx";

export enum MenuOption {
	MAIN_MENU = 0,
	INFORMATION = 1,
	PURCHASE = 2,
	RELOCATE = 3,
	GACHA = 4,
	TILE_INFO = 5,
}

interface MenuProps extends WithStyles<typeof UIStyles> {}

interface MenuState {
	currentMenu: MenuOption;
}

export interface MenuChildProps {
	setMenu: (to: MenuOption) => void;
}

class MenuUI extends React.PureComponent<MenuProps, MenuState> {
	constructor(props: MenuProps) {
		super(props);
		this.state = {
			currentMenu: MenuOption.MAIN_MENU,
		};
	}

	setMenu(to: MenuOption) {
		this.setState({ currentMenu: to });
	}

	renderMenu(currentMenu: MenuOption): React.ReactNode {
		switch (currentMenu) {
			case MenuOption.MAIN_MENU:
				return <MainMenu setMenu={this.setMenu.bind(this)} />;
			case MenuOption.INFORMATION:
				return <InformationMenu setMenu={this.setMenu.bind(this)} />;
			case MenuOption.RELOCATE:
				return <RelocateMenu setMenu={this.setMenu.bind(this)} />;
			case MenuOption.PURCHASE:
				return <PurchaseMenu setMenu={this.setMenu.bind(this)} />;
			case MenuOption.GACHA:
				return <GachaMenu setMenu={this.setMenu.bind(this)} />;
			case MenuOption.TILE_INFO:
				return <TileInfoMenu setMenu={this.setMenu.bind(this)} />;
		}
	}

	render() {
		const { classes } = this.props;
		const { currentMenu } = this.state;
		return (
			<Grid item zeroMinWidth>
				<Paper className={clsx(classes.paper)}>
					{this.renderMenu(currentMenu)}
				</Paper>
			</Grid>
		);
	}
}

export default withStyles(UIStyles)(MenuUI);
