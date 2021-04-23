import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { Team, TeamDocument } from "../src/models/Team";

export interface BoardMap {
    x: number;
    y: number;
    landType: number;
    landOwner?: number;
}
