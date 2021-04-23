import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    if ("role" in req.user) return next();
    else res.send(403).json({ message: "Not a part of committee" }).end();
};
