import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { BoardMap } from "../../typings/BoardMap";
import { MapTile } from "../constants/MapTile";
import { Team, TeamDocument } from "./Team";

const BoardMapSchema = new Schema<BoardMapDocument, BoardMapModel>({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    landType: { type: Number, min: 0, default: 0, max: MapTile._LENGTH },
    landOwner: { type: Number, ref: "Team" },
});

BoardMapSchema.index({ x: 1, y: 1 }, { unique: true });
BoardMapSchema.index({ landType: 1 });

interface BoardMapBaseDocument extends BoardMap, Document {}

export interface BoardMapDocument extends BoardMapBaseDocument {
    landOwner: TeamDocument["_id"];
}

export interface BoardMapPopulatedDocument extends BoardMapBaseDocument {
    //landOwner: TeamDocument;
}

export interface BoardMapModel extends Model<BoardMapDocument> {}

export default model<BoardMapDocument, BoardMapModel>(
    "BoardMap",
    BoardMapSchema
);
