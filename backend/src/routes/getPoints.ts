import { Router } from "express";
import Team from "../models/Team";

const Route = Router();

Route.get("/", async (req, res) => {
  res.status(200);

  return res.json({
    points: (await Team.findOne({ teamId: req.user?.team }).lean()).points,
  });
});

export default Route;
