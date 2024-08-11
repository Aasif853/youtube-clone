const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;
//Using middleware for getting json(Javascript Object Notation) response.
app.use(express.json());
//cors for preventing malicious website to prevent access sensetive information.
app.use(cors());
app.get('/api', (req, res) => {
  res.json('Hello this is from backesnd side');
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
