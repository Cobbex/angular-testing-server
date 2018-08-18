import { accessibleRecordsPlugin } from "@casl/mongoose";
import Debug from "debug";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import paginatePlugin from "mongoose-paginate";
import router from "../routes/router";
const debug = Debug("App");

export default async function createApp() {
  try {
    debug("Starting server...");

    dotenv.config({
      path: "../secure",
    });

    const app = express();

    app.use("/", router);

    app.use("*", (req, res) => {
      res.status(404).send("Not found");
    });

    mongoose.plugin(accessibleRecordsPlugin);
    mongoose.plugin(paginatePlugin);

    const DB = ((process.env.DB_URI as string) + process.env.DB_NAME) as string;
    if (DB) {
      debug("Connecting to DB...");
      await mongoose.connect(
        DB,
        { useNewUrlParser: true },
      );
    } else {
      debug("No DB provided");
    }
    return app;
  } catch (error) {
    throw error;
  }
}
