const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./config.env" });
const db = require("./db");
const port = process.env.PORT || 8005;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
