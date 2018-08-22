import { Ability } from "@casl/ability";
import { IUser } from "../src/models/user";
import { ObjectId } from "bson";

declare module "express" {
  interface Response {
    locals: {
      user: { _id: ObjectId; role: string };
      ability: Ability;
      token: string;
    };
  }
}
