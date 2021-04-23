import { Document, Model, model, Types, Schema, Query } from "mongoose";

const RoundPointsSchema = new Schema<RoundPointsDocument, RoundPointsModel>({
  team: { type: Number, required: true, ref: "Team" },
  round: { type: Number, required: true },
  points: { type: Number, default: 0, min: 0, max: 500 },
});

export interface RoundPoints {
  team: Types.ObjectId;
  round: number;
  points: number;
}

interface RoundPointsBaseDocument extends RoundPoints, Document {}

export interface RoundPointsDocument extends RoundPointsBaseDocument {}

export interface RoundPointsPopulatedDocument extends RoundPointsBaseDocument {}

export interface RoundPointsModel extends Model<RoundPointsDocument> {}

export default model<RoundPointsDocument, RoundPointsModel>(
  "RoundPoints",
  RoundPointsSchema
);
