import { Router } from "express";
import JSONStream from "JSONStream";
import passport from "passport";
import BoardMap from "../models/BoardMap";
import jwt from "jsonwebtoken";

const Route = Router();
const secret = "dsfmrjvgiklordsijgrdsgoijmpdtsoinhdftrhydtr576j5j764573h66543";

Route.post("/login", (req, res, next) => {
  if (
    !("username" in req.body) ||
    !("password" in req.body) ||
    req.body.username == "" ||
    req.body.password == ""
  )
    return res.status(400).json({ message: "Invalid credentials" });
  passport.authenticate(
    "local",
    { session: false },
    (err, user: Express.User, info) => {
      if (err || !user) return res.status(401).send(info).end();
      req.login(user, { session: false }, async (err) => {
        const token = jwt.sign(user, secret, {
          expiresIn: "6h",
        });
        res.status(200).json({ token }).end();
      });
    }
  )(req, res, next);
});

Route.get("/verify", (req, res, next) => {
  res.status(200).end();
});

export default Route;
