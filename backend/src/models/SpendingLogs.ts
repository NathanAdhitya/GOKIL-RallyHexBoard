import { Document, Model, model, Types, Schema, Query } from "mongoose";

const SpendingLogsSchema = new Schema<SpendingLogsDocument, SpendingLogsModel>({
    team: { type: Types.ObjectId, required: true, ref: "Team" },
    points: { type: Number, default: 0, min: 0, max: 500 },
});

export interface SpendingLogs {
    team: Types.ObjectId;
    points: number;
}

interface SpendingLogsBaseDocument extends SpendingLogs, Document {}

export interface SpendingLogsDocument extends SpendingLogsBaseDocument {}

export interface SpendingLogsPopulatedDocument
    extends SpendingLogsBaseDocument {}

export interface SpendingLogsModel extends Model<SpendingLogsDocument> {}

export default model<SpendingLogsDocument, SpendingLogsModel>(
    "SpendingLogs",
    SpendingLogsSchema
);
