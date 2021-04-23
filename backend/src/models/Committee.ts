import { Document, Model, model, Types, Schema, Query } from "mongoose";

const CommitteeSchema = new Schema<CommitteeDocument, CommitteeModel>({
    username: { type: String, required: true },
    displayname: { type: String, required: true },
    password: { type: String, required: true },
    assigned: [Number],
    role: { type: Number, default: 10 },
});

export interface Committee {
    username: string;
    displayname: string;
    password: string;
    assigned: number[];
    role: number;
}

interface CommitteeBaseDocument extends Committee, Document {}

export interface CommitteeDocument extends CommitteeBaseDocument {}

export interface CommitteePopulatedDocument extends CommitteeBaseDocument {}

export interface CommitteeModel extends Model<CommitteeDocument> {}

export default model<CommitteeDocument, CommitteeModel>(
    "Committee",
    CommitteeSchema
);
