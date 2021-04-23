import { ExtSocket } from "App";
import { BoardGameEvent } from "../../constants/boardgame";
import { GachaPrice, MapTile } from "../../constants/MapTile";
import { usePassport } from "../../controllers/passport";
import { BuildFailReasons, doBuild, doRelocate } from "../../lib/boardGame";
import Team from "../../models/Team";
import * as SocketIO from "socket.io";

const lockedTiles: number[][] = [];

export type BuildCallback = (status: any) => void;

export default (io: SocketIO.Server, socket: ExtSocket) => {
  socket.on(
    BoardGameEvent.BUILD,
    async (params: BoardGame.BuildParams, callback: BuildCallback) => {
      // check if committee or player
      if (!socket.user) return new Error("Invalid auth");

      // check all params
      const { x, y, landType } = params;
      if (x === undefined || y === undefined || landType === undefined) {
        return new Error("Incomplete parameters");
      }

      const results = await doBuild(socket.user.team, landType, x, y);
      callback(results);

      console.log("build results: " + results);

      if (results instanceof Array && results[0] === true) {
        io.emit(BoardGameEvent.BUILD, {
          x,
          y,
          landType,
          landOwner: socket.user.team,
        });
        socket.broadcast
          .to(socket.user.team.toString())
          .emit(BoardGameEvent.BALANCE_UPDATE, results[1]);
      }

      // deduct balance.
      //await Team.findOneAndUpdate({teamId: socket.user.team, points: {$gte: }}).lean();
    }
  );

  socket.on(BoardGameEvent.GACHA, async (callback) => {
    // check if committee or player
    if (!socket.user) return new Error("Invalid auth");

    // make sure has enough balance.
    const teamId = socket.user.team;
    const totalCost = GachaPrice;
    const randResult = Math.floor(Math.random() * (9 - 6 + 1)) + 6;

    return await Team.findOneAndUpdate(
      { teamId, points: { $gte: totalCost } },
      { $inc: { points: -totalCost } },
      { new: true }
    )
      .then(async (newTeam) => {
        // team not found, meaning not enough points
        if (!newTeam) return callback(0);

        // build on map, the tile can be nonexistant in DB.
        return await Team.findOneAndUpdate(
          { teamId },
          { $inc: { [`gachaInventory.${randResult}`]: 1 } },
          { upsert: true, new: true }
        ).then(() => {
          // everything succeeded?
          return callback(randResult, newTeam.gachaInventory);
        });
      })
      .catch((e) => {
        return callback(0);
      });
  });

  socket.on(
    BoardGameEvent.RELOCATE,
    async (params: BoardGame.RelocateParams, callback: BuildCallback) => {
      // check if committee or player
      if (!socket.user) return new Error("Invalid auth");

      // check all params
      const { x, y } = params;
      if (x === undefined || y === undefined) {
        return new Error("Incomplete parameters");
      }

      const results = await doRelocate(socket.user.team, x, y);
      callback(results);

      console.log("relocate results: " + results);

      if (results instanceof Array && results[0] === true) {
        io.emit(BoardGameEvent.BUILD, {
          x,
          y,
          landType: MapTile.ROAD,
          landOwner: socket.user.team,
        });
        socket.broadcast
          .to(socket.user.team.toString())
          .emit(BoardGameEvent.BALANCE_UPDATE, results[1]);
      }
    }
  );
};

declare global {
  namespace BoardGame {
    interface Coordinates {
      x: number;
      y: number;
    }

    interface BuildParams extends Coordinates {
      landType: MapTile;
    }

    interface RelocateParams extends Coordinates {}
  }
}
