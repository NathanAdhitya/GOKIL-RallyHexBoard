import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { GameLogs } from "../constants/GameLogs";
import { MapTile } from "../constants/MapTile";
import { Team, TeamDocument } from "./Team";

const BoardGameLogSchema = new Schema<BoardGameLogDocument, BoardGameLogModel>({
  reason: { type: Number, required: true },
  amount: { type: Number, required: true },
  x: { type: Number },
  y: { type: Number },
  team: { type: Number, ref: "Team", required: true },
});

BoardGameLogSchema.index({ x: 1, y: 1 }, { unique: true });

export interface BoardGameLog extends Record<string, unknown> {
  reason: GameLogs;
  amount: number;
  x?: number;
  y?: number;
  team: number;
}

interface BoardGameLogBaseDocument extends BoardGameLog, Document {}

export interface BoardGameLogDocument extends BoardGameLogBaseDocument {}

export interface BoardGameLogPopulatedDocument
  extends BoardGameLogBaseDocument {}

export interface BoardGameLogModel extends Model<BoardGameLogDocument> {}

export default model<BoardGameLogDocument, BoardGameLogModel>(
  "BoardGameLog",
  BoardGameLogSchema
);
