import Debug from "debug";
import createApp from "./server/app";
const debug = Debug("App");

debug("Port:", process.env.PORT);

createApp()
  .then((app) => {
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      debug(`Server started on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    debug("Error:", err.message);
    throw err;
  });
