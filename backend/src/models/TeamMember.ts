import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { TeamDocument } from "./Team";

const TeamMemberSchema = new Schema<TeamMemberDocument, TeamMemberModel>({
  username: { type: String, required: true },
  displayname: { type: String, required: true },
  password: { type: String, required: true },
  team: { type: Number, ref: "Team", required: true },
});

export interface TeamMember {
  username: string;
  displayname: string;
  password: string;
  team: number;
}

interface TeamMemberBaseDocument extends TeamMember, Document {}

export interface TeamMemberDocument extends TeamMemberBaseDocument {}

export interface TeamMemberPopulatedDocument extends TeamMemberBaseDocument {}

export interface TeamMemberModel extends Model<TeamMemberDocument> {}

export default model<TeamMemberDocument, TeamMemberModel>(
  "TeamMember",
  TeamMemberSchema
);
