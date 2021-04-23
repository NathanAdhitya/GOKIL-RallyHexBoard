import { Document, Model, model, Types, Schema, Query } from "mongoose";

const RoundSchema = new Schema<RoundDocument, RoundModel>({
    round: { type: Number, required: true, index: true },
    starTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});

export interface Round {
    round: number;
    startTime: Date;
    endTime: Date;
}

interface RoundBaseDocument extends Round, Document {}

export interface RoundDocument extends RoundBaseDocument {}

export interface RoundPopulatedDocument extends RoundBaseDocument {}

export interface RoundModel extends Model<RoundDocument> {}

export default model<RoundDocument, RoundModel>("Round", RoundSchema);
