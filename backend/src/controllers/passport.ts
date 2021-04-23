/**
 * @name passport
 * @description Handles passport-related functions
 */
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import SocketIO from "socket.io";
import { hashPromise } from "../lib/hashPromise";
import Committee from "../models/Committee";
import TeamMember from "../models/TeamMember";

const secret = "dsfmrjvgiklordsijgrdsgoijmpdtsoinhdftrhydtr576j5j764573h66543";

const hashAlgorithm = "sha256";

passport.use(
  new LocalStrategy({}, async (username, password, done) => {
    try {
      // check with teammembers
      const possibleUsers = await Promise.all([
        TeamMember.findOne({ username }).lean(),
      ]);

      // check each of them
      const results = await Promise.all(
        possibleUsers.map(async (user) => {
          if (!user) return;
          // check the password, hash and check.
          const hashedPassword = (
            await hashPromise(hashAlgorithm, Buffer.from(password))
          ).toString("hex");

          console.log("hashed: " + hashedPassword);
          console.log("actual: " + user.password);

          if (user.password === hashedPassword) {
            // remove pass from end hash.
            delete user.password;
            done(null, user);
            return true;
          }
        })
      );

      if (!results.includes(true))
        return done(null, false, { message: "Invalid credentials" });
    } catch (e) {
      done(e, null);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    function (jwtPayload, cb) {
      cb(null, jwtPayload);
    }
  )
);

/**
 * Passport JWT Manager.
 */
export function usePassport(req: Request, res: Response, next: NextFunction) {
  return passport.authenticate(
    "jwt",
    { session: false },
    function (e, user, info) {
      if (user) {
        req.user = user;
        return next();
      }
      return res.status(401).json(info);
    }
  )(req, res, next);
}
