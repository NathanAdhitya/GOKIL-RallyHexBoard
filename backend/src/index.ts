import { ChatServer } from "./App";
import db from "./controllers/database";
import initial_map from "./initial_map.json";
import BoardMapModel from "./models/BoardMap";
import Team from "./models/Team";
import TeamMember from "./models/TeamMember";

import csvParse from "csv-parse/lib/sync";
import csvStringify from "csv-stringify/lib/sync";
import fs from "fs";
import crypto from "crypto";
import { ObjectId } from "bson";
import cryptoRandomString, { async } from "crypto-random-string";

import cryptoAsync from "@ronomon/crypto-async";
import Committee from "./models/Committee";
import { hashPromise } from "./lib/hashPromise";
import GameSession from "./models/GameSession";

db();
let app = new ChatServer().app;

// configure interactive consoel
const stdin = process.openStdin();
stdin.addListener("data", function (d: string) {
  const input = d.toString().trim().toLowerCase();
  switch (input) {
    case "newmap":
      (async () => {
        console.log("regenerating map");
        await BoardMapModel.db.dropCollection("boardmaps");
        initial_map.forEach((data1, x) => {
          data1.forEach(async (tileData, y) => {
            if (tileData != null)
              await BoardMapModel.findOneAndUpdate(
                {
                  x,
                  y,
                },
                {
                  x,
                  y,
                  landType: tileData,
                },
                {
                  setDefaultsOnInsert: true,
                  upsert: true,
                }
              );
          });
        });
        console.log("regenerating map done");
      })();
      break;
    case "resetcommittee":
      (async () => {
        console.log("regenerating committee data");
        const parsed = csvParse(fs.readFileSync("src/initial_committee.csv"), {
          delimiter: ";",
          skip_empty_lines: true,
        }) as Array<any>;
        const results = [];
        await Committee.deleteMany({});
        await Promise.all(
          parsed.map(async (data) => {
            const pass = cryptoRandomString({
              length: 8,
              type: "alphanumeric",
            });

            await Committee.create({
              displayname: data[0],
              username: data[0],
              role: Number(data[1]),
              assigned: [Number(data[2])],
              password: (
                await hashPromise("sha256", Buffer.from(pass))
              ).toString("hex"),
            });

            results.push({
              username: data[0],
              password: pass,
            });
          })
        );
        fs.writeFileSync(
          "committee.csv",
          csvStringify(await Promise.all(results), {
            delimiter: ";",
          })
        );
        console.log("done regenerating committee data");
      })();
      break;
    case "resetteammembers":
      (async () => {
        console.log("regenerating team members");
        await Team.deleteMany({});
        await TeamMember.deleteMany({});

        const parsed = csvParse(fs.readFileSync("src/initial_teams.csv"), {
          delimiter: ",",
          columns: true,
          skip_empty_lines: true,
        }) as Array<any>;

        const createdTeamMembers = [];

        Promise.all(
          parsed.map(async (teamData, index) => {
            // for every team
            const newTeam = await Team.create({
              _id: new ObjectId(index + 1),
              teamId: index + 1,
              name: teamData["Nama kelompok."],
            });

            // create the members and randomize the passwords.
            const things = [
              [
                teamData["Nama (1)"].trim(),
                `${
                  (teamData["Nama (1)"] as string)
                    .toLowerCase()
                    .trim()
                    .split(" ")[0]
                }.${cryptoRandomString({
                  length: 3,
                  type: "numeric",
                })}`,
                cryptoRandomString({
                  length: 8,
                  type: "alphanumeric",
                }),
              ],
              [
                teamData["Nama (2)"].trim(),
                `${
                  (teamData["Nama (2)"] as string)
                    .toLowerCase()
                    .trim()
                    .split(" ")[0]
                }.${cryptoRandomString({
                  length: 3,
                  type: "numeric",
                })}`,
                cryptoRandomString({
                  length: 8,
                  type: "alphanumeric",
                }),
              ],
              [
                teamData["Nama (3)"].trim(),
                `${
                  (teamData["Nama (3)"] as string)
                    .toLowerCase()
                    .trim()
                    .split(" ")[0]
                }.${cryptoRandomString({
                  length: 3,
                  type: "numeric",
                })}`,
                cryptoRandomString({
                  length: 8,
                  type: "alphanumeric",
                }),
              ],
            ];

            await Promise.all(
              things.map(async (d) => {
                createdTeamMembers.push({
                  ["Full Name"]: d[0],
                  ["Username"]: d[1],
                  ["Password"]: d[2],
                });
                const hash = crypto.createHash("sha256");
                return TeamMember.create({
                  displayname: d[0],
                  username: d[1],
                  team: newTeam.teamId,
                  password: await new Promise((resolve, reject) =>
                    cryptoAsync.hash(
                      "sha256",
                      Buffer.from(d[2]),
                      (error, hash) => resolve(hash.toString("hex"))
                    )
                  ),
                });
              })
            );
          })
        ).then(async () => {
          fs.writeFileSync(
            "members.csv",
            csvStringify(await Promise.all(createdTeamMembers), {
              delimiter: ";",
            })
          );
          console.log("reset team members done.");
        });
      })();
      break;
    case "initround":
      (async () => {
        await GameSession.deleteMany({});
        await GameSession.create({ currentRound: 0 });
        console.log("init round done.");
      })();
      break;
  }
});

export { app };
