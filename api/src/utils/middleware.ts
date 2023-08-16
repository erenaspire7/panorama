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
      await jwt.verify(token, process.env.JWT_TOKEN_SECRET!);

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
  }

  return res.status(403).send({
    message: "No token provided.",
  });
};
