import { Router } from "express";
import GameSession from "../models/GameSession";

const Route = Router();

Route.get("/", async (req, res) => {
  res.status(200);

  return res.json({
    round: (await GameSession.findOne({}).lean()).currentRound,
  });
});

export default Route;
