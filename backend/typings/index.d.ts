import TeamMember, {
  TeamMember as ITeamMember,
} from "../src/models/TeamMember";
import Committee, { Committee as ICommittee } from "../src/models/Committee";
import SocketIO from "socket.io";

export interface ChatMessage {
  author: string;
  message: string;
}

declare module "express" {
  export interface Request {
    user?: Omit<ITeamMember, "password">;
  }
  export interface RequestHandler {
    user?: Omit<ITeamMember, "password">;
  }
  export interface RequestHandlerParams {
    user?: Omit<ITeamMember, "password">;
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }

    export interface RequestHandlerParams {
      user?: User;
    }

    export interface RequestHandler {
      user?: User;
    }

    interface User extends Omit<ITeamMember, "password"> {}
  }
}
