import { Router } from "express";

import getMap from "./getMap";
import auth from "./auth";
import "../controllers/passport";
import committee from "./committee";
import committeeOnly from "../lib/committeeOnly";
import { usePassport } from "../controllers/passport";
import getPoints from "./getPoints";
import { advanceTheRound } from "../lib/boardGame";
import getRound from "./getRound";
import getInventory from "./getInventory";

const Route = Router();

Route.use("/getMap", usePassport, getMap);
Route.use("/getPoints", usePassport, getPoints);
Route.use("/getRound", usePassport, getRound);
Route.use("/getInventory", usePassport, getInventory);
//Route.use("/committe", /*usePassport, committeeOnly,*/ committee);
Route.use("/auth", auth);

export default Route;
