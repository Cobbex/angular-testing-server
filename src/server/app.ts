import { accessibleRecordsPlugin } from "@casl/mongoose";
import Debug from "debug";
import express from "express";
import mongoose from "mongoose";
import router from "../routes/router";
const debug = Debug("App");
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

export default async function createApp() {
  try {
    debug("Starting server...");

    const app = express();

    app.use(helmet());
    app.use(
      bodyParser.json({
        limit: "15mb",
      }),
    );
    app.use(cors());

    app.use("/api/", router);

    app.use("*", (req, res) => {
      res.status(404).send("Not found");
    });

    mongoose.plugin(accessibleRecordsPlugin);

    const DB = (process.env as any).DB_URI + (process.env as any).DB_NAME;
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
