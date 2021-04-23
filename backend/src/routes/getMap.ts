import { Router } from "express";
import JSONStream from "JSONStream";
import BoardMap from "../models/BoardMap";

const Route = Router();

Route.get("/", (req, res) => {
    res.status(200);

    BoardMap.find({})
        .select("-__v -_id")
        .lean()
        .cursor()
        .pipe(JSONStream.stringify())
        .pipe(res.type("json"))
        .on("finish", () => {
            res.end();
        });
});

export default Route;
