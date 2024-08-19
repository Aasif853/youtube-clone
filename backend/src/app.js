import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import errorHandler from "./middleware/errorHandler.mjs";

const app = express();

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

app.use("/api/v1/", routes);

app.use(errorHandler);

export default app;
