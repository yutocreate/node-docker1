const express = require("express");
const app = express();

const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("src/database.sqlite3");
console.log(db);

db.serialize(function () {
  db.run(
    'INSERT INTO users (name, profile) VALUES ("Subaru", "エミリアたんマジ天使！")'
  );
});

db.close();

app.get("/api/v1/hello/", (req, res) => {
  res.json({ message: "Hello, World" });
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listen on port " + port);
