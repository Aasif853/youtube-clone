import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import path from "path";

//cors for preventing malicious website to prevent access sensetive information.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

//Using middleware for getting json(Javascript Object Notation) response.
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import routes from "./routes/routes.js";
app.use("/api/v1/", routes);
app.use("/", (req, res) => {
  console.log("asdf", path);
  res.sendStatus(200);
});

export default app;
