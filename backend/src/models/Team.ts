import { MapTile } from "../constants/MapTile";
import { Document, Model, model, Types, Schema, Query } from "mongoose";

const TeamSchema = new Schema<TeamDocument, TeamModel>({
  teamId: { type: Number, required: true },
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  gachaInventory: { type: Object, default: {} },
});

export interface GachaInventory {
  [MapTile.PRODUCTION_BUFF]?: number;
  [MapTile.PRODUCTION_DEBUFF]?: number;

  [MapTile.DISCOUNT_BUFF]?: number;
  [MapTile.COST_DEBUFF]?: number;
}

export interface Team {
  teamId: number;
  name: string;
  points: number;
  gachaInventory: GachaInventory;
}

interface TeamBaseDocument extends Team, Document {}

export interface TeamDocument extends TeamBaseDocument {}

export interface TeamPopulatedDocument extends TeamBaseDocument {}

export interface TeamModel extends Model<TeamDocument> {}

export default model<TeamDocument, TeamModel>("Team", TeamSchema);
