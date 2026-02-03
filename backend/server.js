const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("I'm Alive!");
});


app.get("/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Movies route
app.get("/movies", (req, res) => {
  const data = require('./movies.json');
  const limit = req.query.limit;
  if (limit) {
    return res.json(data.slice(0, limit));
  }
  res.json(data);
});

// Movies route with limit
app.get("/movies/:limit", (req, res) => {
  const data = require('./movies.json');
  const limit = req.params.limit;
  res.json(data.slice(0, limit));
});

// Get movie image
app.use('/images', (express.static('images')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
