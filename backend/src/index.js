const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const routes = require("./routes");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// serve schema
app.use("/schema", express.static(path.join(__dirname, "..", "schema")));

app.use("/api", routes);

app.get("/", (req, res) => res.json({ ok: true, message: "Backend running" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
