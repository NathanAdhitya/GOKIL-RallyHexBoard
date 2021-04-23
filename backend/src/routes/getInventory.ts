import { Router } from "express";
import Team from "../models/Team";

const Route = Router();

Route.get("/", async (req, res) => {
  res.status(200);

  return res.json({
    inventory: (await Team.findOne({ teamId: req.user?.team }).lean())
      .gachaInventory,
  });
});

export default Route;
