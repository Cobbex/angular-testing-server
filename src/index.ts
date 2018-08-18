import createApp from "./server/app";
import Debug from "debug";
const debug = Debug("App");

createApp()
  .then(app => {
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      debug(`Server started on http://localhost:${port}`);
    });
  })
  .catch(err => {
    debug("Error:", err.message);
    throw err;
  });
