const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const dbPath = "./db/database.sqlite3";
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/v1/users", (req, res) => {
  const db = new sqlite3.Database(dbPath);

  db.all("SELECT * FROM users", (err, rows) => {
    res.json(rows);
  });

  db.close();
});

app.get("/api/v1/:id", (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  db.get(`select * from users where id = ${id}`, (err, row) => {
    res.json(row);
  });

  db.close();
});

app.get("/api/v1", (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const keyword = req.query.q;

  db.all(`select * from users where name like "%${keyword}%"`, (err, rows) => {
    res.json(rows);
  });
  db.close();
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listen on port:" + port);
