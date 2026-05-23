const express = require("express");
const _ = require("lodash");
const app = express();

// Hardcoded secret - Snyk Code will flag this
const DB_PASSWORD = "superSecret123!";
const API_KEY = "hardcoded-api-key-abc123";

app.get("/", (req, res) => {
  res.send("Hello from snyk-demo-app!");
});

// Unsafe eval - Snyk Code will flag this
app.get("/run", (req, res) => {
  const result = eval(req.query.cmd);
  res.send(`Result: ${result}`);
});

// Using lodash (vulnerable version imported)
app.get("/merge", (req, res) => {
  const merged = _.merge({}, JSON.parse(req.query.data));
  res.json(merged);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`DB_PASSWORD: ${DB_PASSWORD}`);
});