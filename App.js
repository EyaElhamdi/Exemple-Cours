const express = require("express");
const app = express();
let count = 0;

const logger = function (req, res, next) {
  count++;
  const { method, url } = req;
  const date = new Date().toLocaleString();
  console.log(`${date}: ${method} ${url} nombre d'accès : ${count}`);
  next();
};

app.use(logger);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/hello", function (req, res) {
  res.send("une autre journalisation Hello World!");
});

const hostname = "127.0.0.1";
const port = process.env.PORT || 3080;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
