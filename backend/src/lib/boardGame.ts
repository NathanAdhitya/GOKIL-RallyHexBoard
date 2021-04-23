import BoardMap, { BoardMapDocument } from "../models/BoardMap";
import * as Honeycomb from "honeycomb-grid";
import {
  BoardDimensions,
  MapTile,
  TileBaseReward,
  TileBonusMultiplier,
  TilePrices,
} from "../constants/MapTile";
import Team from "../models/Team";
import { LeanDocument } from "mongoose";
import BoardGameLog from "../models/BoardGameLog";
import GameSession from "../models/GameSession";
import * as SocketIO from "socket.io";
import { BoardGameEvent } from "../constants/boardgame";

const Hex = Honeycomb.extendHex({});
const Grid = Honeycomb.defineGrid(Hex);
const grid = Grid.rectangle(BoardDimensions);

export enum BuildFailReasons {
  NOT_BUILDABLE,
  NO_NEARBY,
  INSUFFICIENT_POINTS,
  TILE_OCCUPIED,
  INVALID_COORDINATES,
}

export enum TransactionReasons {
  BUILD,
  REFUND,
  NEW_ROUND,
}

// TODO: CHECK VALID COORDINATES
function isCoordinatesValid(x: number, y: number) {
  return grid.get(Hex(x, y)) !== undefined;
}

export async function doRelocate(teamId: number, x: number, y: number) {
  if (!isCoordinatesValid(x, y)) return BuildFailReasons.INVALID_COORDINATES;

  const neighbors = await getNeighbors(x, y);
  const mult = getCostMultiplier(neighbors);
  const totalCost = Math.floor(mult * TilePrices[MapTile.ROAD] * 8); // should be 200

  return buildAtTile(teamId, MapTile.ROAD, x, y, totalCost);
}

export async function doBuild(
  teamId: number,
  landType: MapTile,
  x: number,
  y: number
) {
  if (!isCoordinatesValid(x, y)) return BuildFailReasons.INVALID_COORDINATES;

  const thatTile = await BoardMap.findOne({ x, y }).lean();
  // make sure it's something buildable on
  if ([MapTile.MOUNTAIN, MapTile.WATER].includes(landType))
    return BuildFailReasons.NOT_BUILDABLE;

  const isGachaInventory = [
    MapTile.DISCOUNT_BUFF,
    MapTile.COST_DEBUFF,
    MapTile.PRODUCTION_BUFF,
    MapTile.PRODUCTION_DEBUFF,
  ].includes(landType);
  if (!TilePrices[landType] && !isGachaInventory)
    return BuildFailReasons.NOT_BUILDABLE;

  if (isGachaInventory) {
    // custom build at tile implementation, it's now inventory....
    return Team.findOneAndUpdate(
      { teamId, [`gachaInventory.${landType}`]: { $gte: 1 } },
      { $inc: { [`gachaInventory.${landType}`]: -1 } },
      { new: true }
    )
      .then(async (newTeam) => {
        // team not found, meaning not enough points
        if (!newTeam) return BuildFailReasons.INSUFFICIENT_POINTS;

        logTransaction(teamId, TransactionReasons.BUILD, 1, x, y);

        // build on map, the tile can be nonexistant in DB.
        return await BoardMap.findOneAndUpdate(
          { x, y, $or: [{ landType: undefined }, { landType: MapTile.WATER }] },
          { landType, landOwner: teamId },
          { upsert: true, new: true }
        )
          .then(() => {
            // everything succeeded?
            return [true, newTeam.points, newTeam.gachaInventory];
          })
          .catch(async () => {
            // gib back the inventory thing
            await Team.findOneAndUpdate(
              { teamId },
              { $inc: { [`gachaInventory.${landType}`]: 1 } }
            );
            logTransaction(teamId, TransactionReasons.REFUND, 1, x, y);
            return BuildFailReasons.TILE_OCCUPIED;
          });
      })
      .catch((e) => {
        return BuildFailReasons.INSUFFICIENT_POINTS;
      });
  } else {
    const neighbors = await getNeighbors(x, y);

    // check allowed
    const neighborCheck = checkAdjacentTeamLand(neighbors, teamId);
    if (!neighborCheck) return BuildFailReasons.NO_NEARBY;

    // calculate cost
    const totalCost = Math.floor(
      getCostMultiplier(neighbors) * TilePrices[landType]
    );

    return buildAtTile(teamId, landType, x, y, totalCost);
  }
}

async function buildAtTile(
  teamId: number,
  landType: MapTile,
  x: number,
  y: number,
  totalCost: number
) {
  // deduct money from team.
  return await Team.findOneAndUpdate(
    { teamId, points: { $gte: totalCost } },
    { $inc: { points: -totalCost } },
    { new: true }
  )
    .then(async (newTeam) => {
      // team not found, meaning not enough points
      if (!newTeam) return BuildFailReasons.INSUFFICIENT_POINTS;

      logTransaction(teamId, TransactionReasons.BUILD, totalCost, x, y);

      BoardMap.findOne({ x, y });

      try {
        // build on map, the tile can be nonexistant in DB.
        return await BoardMap.findOneAndUpdate(
          { x, y, $or: [{ landType: undefined }, { landType: MapTile.WATER }] },
          { landType, landOwner: teamId },
          { upsert: true, new: true }
        )
          .then(() => {
            // everything succeeded?
            return [true, newTeam.points, newTeam.gachaInventory];
          })
          .catch(async () => {
            // gib back money
            await Team.findOneAndUpdate(
              { teamId },
              { $inc: { points: totalCost } }
            );
            logTransaction(teamId, TransactionReasons.REFUND, totalCost, x, y);
            return BuildFailReasons.TILE_OCCUPIED;
          });
      } catch (e) {}
    })
    .catch((e) => {
      return BuildFailReasons.INSUFFICIENT_POINTS;
    });
}

function logTransaction(
  teamId: number,
  reason: TransactionReasons,
  amount: number,
  x: number,
  y: number
) {
  BoardGameLog.create({ amount, team: teamId, reason, x, y });
}

function checkAdjacentTeamLand(
  neighbors: LeanDocument<BoardMapDocument>[],
  teamId: number
) {
  return neighbors
    .map((neighbor) => (neighbor ? neighbor.landOwner === teamId : false))
    .includes(true);
}

function getCostMultiplier(
  neighbors: LeanDocument<BoardMapDocument>[],
  index: number = 1
) {
  return neighbors.reduce((total, neighbor) => {
    var culMul = 1;
    if (neighbor)
      if (TileBonusMultiplier[neighbor.landType])
        if (TileBonusMultiplier[neighbor.landType][index])
          culMul = TileBonusMultiplier[neighbor.landType][index];
    return total * culMul;
  }, 1);
}

async function getNeighbors(x: number, y: number) {
  const toCheck = Hex(x, y);
  const neighbors = grid.neighborsOf(toCheck);

  const res = Promise.all(
    neighbors.map((coords) => BoardMap.findOne(coords).lean())
  );

  return res;
}

/** what the feck am i doing */
export async function advanceTheRound(io: SocketIO.Server, addKelompokPoints) {
  const start = Date.now();
  // for each tile.
  const tiles = await BoardMap.find({}).lean();
  const convertedTiles: Record<
    number,
    Record<number, LeanDocument<BoardMapDocument>>
  > = [];

  // group tiles by coords for easier neighbor accessing
  tiles.forEach((tile) => {
    convertedTiles[tile.x] = convertedTiles[tile.x] ?? {};
    convertedTiles[tile.x][tile.y] = tile;
  });

  const teamProfits: number[] = addKelompokPoints;
  console.log;

  // apply the cost multiplier

  Object.keys(convertedTiles).forEach((k1) => {
    Object.keys(convertedTiles[k1]).forEach((k2) => {
      const convTile = convertedTiles[k1][k2];

      // get the neighbors
      const toCheck = Hex(convTile.x, convTile.y);
      const neighbors = grid.neighborsOf(toCheck);
      const mult = getCostMultiplier(
        neighbors.map((coords) =>
          coords
            ? convertedTiles[coords.x]
              ? convertedTiles[coords.x][coords.y]
              : undefined
            : undefined
        ),
        0
      );
      const profit = TileBaseReward[convTile.landType]
        ? TileBaseReward[convTile.landType] * mult
        : 0;
      teamProfits[convTile.landOwner] =
        profit + (teamProfits[convTile.landOwner] ?? 0);
    });
  });

  const endTeamResults = await Promise.all(
    teamProfits.map((profit, team) =>
      Team.findOneAndUpdate(
        { teamId: team },
        {
          $inc: {
            points: Math.floor(profit),
          },
        },
        { new: true }
      )
    )
  );

  console.table(teamProfits);

  console.log("Round advance took " + (Date.now() - start) + "ms");
  // advance the round in mongo
  const nextRound = await GameSession.findOneAndUpdate(
    {},
    { $inc: { currentRound: 1 } },
    { new: true, upsert: true }
  );

  // announce
  endTeamResults.forEach((team) => {
    if (!team) return;
    io.to(team.teamId.toString()).emit(
      BoardGameEvent.NEW_ROUND,
      team.points,
      nextRound.currentRound
    );
  });
  console.log("Announced new round and profits");
}
