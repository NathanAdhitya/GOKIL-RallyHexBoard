import { Document, Model, model, Types, Schema, Query } from "mongoose";

const GameSessionSchema = new Schema<GameSessionDocument, GameSessionModel>({
  currentRound: { type: Number, default: 0 },
});

export interface GameSession {
  currentRound: number;
}

interface GameSessionBaseDocument extends GameSession, Document {}

export interface GameSessionDocument extends GameSessionBaseDocument {}

export interface GameSessionPopulatedDocument extends GameSessionBaseDocument {}

export interface GameSessionModel extends Model<GameSessionDocument> {}

export default model<GameSessionDocument, GameSessionModel>(
  "GameSession",
  GameSessionSchema
);
