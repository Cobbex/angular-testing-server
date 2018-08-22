import { Ability } from "@casl/ability";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/user";
import { getAbilitiesFromToken } from "./abilities";
const debug = Debug("App");

export function generateToken(payload: any) {
  return jsonwebtoken.sign(payload, (process.env as any).SECRET, {
    expiresIn: "1m",
  });
}

export function getToken(req: Request) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
}

export async function login(email: string, password: string) {
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isCorrect = await user.compare(password);
      if (isCorrect) {
        return user;
      }

      throw new Error("Password incorrect");
    }
    throw new Error("User not found");
  } catch (error) {
    return null;
  }
}

export async function refreshToken(token: string) {
  try {
    const decodedToken = jsonwebtoken.verify(
      token,
      (process.env as any).SECRET,
    );
    if (decodedToken) {
      const signedToken = generateToken(decodedToken);
      return signedToken;
    }

    return null;
  } catch (error) {
    throw error;
  }
}

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getToken(req);
    if (token) {
      const decoded: any = jsonwebtoken.verify(
        token,
        (process.env as any).SECRET,
      );
      if (decoded) {
        debug("DECODED:", decoded);
        const user = await User.findById(decoded.userId);
        if (user) {
          res.locals.user = {
            _id: user._id,
            role: user.role,
          };
          res.locals.token = token;
          res.locals.ability = getAbilitiesFromToken(decoded);
          next();
        } else {
          throw new Error("User not found");
        }
      } else {
        throw new Error("Token not valid");
      }
    } else {
      throw new Error("No token");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}
