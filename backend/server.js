require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const video = require("./src/routes/video");
const connectDatabase = require("./src/db/database");

app.use(express.json());
app.use("/api", video);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

const port = process.env.PORT | 4000;

connectDatabase().then(() => {
	app.listen(port, () => console.log("http://localhost:3000"));
});
