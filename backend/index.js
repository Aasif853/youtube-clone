// const express = require('express');
import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
import errorHandler from './middleware/errorHandler.mjs';
const app = express();
const PORT = process.env.PORT || 3000;
//Using middleware for getting json(Javascript Object Notation) response.
app.use(express.json());

//cors for preventing malicious website to prevent access sensetive information.
app.use(cors());

app.use('/api/v1/', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
