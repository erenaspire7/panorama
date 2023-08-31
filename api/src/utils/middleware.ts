import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const tokenChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get Token From Header
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    try {
      var decoded = await jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
      res.locals.user_id = (<any>decoded).id;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
  } else {
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};

export { tokenChecker };
