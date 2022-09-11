const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const dbPath = "./db/database.sqlite3";
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    if (!row) {
      res.status(404).send({ error: "Not Found!" });
    } else {
      res.status(200).json(row);
    }
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

const run = async (sql, db) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve();
      }
    });
  });
};

app.post("/api/v1/users", async (req, res) => {
  const db = new sqlite3.Database(dbPath);

  if (!req.body.name || req.body.name === "") {
    res.status(400).send({ error: "ユーザー名が指定されていません。" });
  } else {
    const name = req.body.name;
    const profile = req.body.profile ? req.body.profile : "";
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";

    try {
      await run(
        `insert into users (name, profile, date_of_birth) values ("${name}", "${profile}", "${dateOfBirth}")`,
        db
      );
      res.status(201).send({ message: "新規ユーザーを作成しました。" });
    } catch (e) {
      res.status(500).send({ error: e });
    }
    db.close();
  }
});

app.put("/api/v1/users/:id", async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({ error: "ユーザー名が指定されていません。" });
  } else {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;

    db.get(`select * from users where id=${id}`, async (err, row) => {
      if (!row) {
        res.status(404).send({ error: "指定されたユーザーが見つかりません。" });
      } else {
        const name = req.body.name ? req.body.name : row.name;
        const profile = req.body.profile ? req.body.profile : row.profile;
        const dateOfBirth = req.body.date_of_birth
          ? req.body.date_of_birth
          : row.date_of_birth;

        try {
          await run(
            `update users set name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" where id=${id}`,
            db
          );
          res.status(200).send({ message: "ユーザー情報を更新しました" });
        } catch (e) {
          res.status(500).send({ error: e });
        }
      }
    });
    db.close();
  }
});

app.delete("/api/v1/users/:id", async (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  db.get(`select * from users where id=${id}`, async (err, row) => {
    if (!row) {
      res.status(404).send({ error: "指定されたユーザーが見つかりません。" });
    } else {
      await run(`delete from users where id=${id}`, db);
      try {
        res.status(200).send({ message: "ユーザーを削除しました" });
      } catch (e) {
        res.status(500).send({ error: e });
      }
    }
  });
  db.close();
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listen on port:" + port);
