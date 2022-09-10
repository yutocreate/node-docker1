const express = require("express"); // expressモジュールを読み込む
const multer = require("multer"); // multerモジュールを読み込む
const uuidv4 = require("uuid").v4; // uuidモジュールを読み込む

const app = express(); // expressアプリを生成する
app.use(multer().none()); // multerでブラウザから送信されたデータを解釈する
app.use(express.static("src/public/")); // webフォルダの中身を公開する
app.disable("etag");
// TODOリストデータ
const todoList = [];

// http://localhost:3000/api/v1/list にアクセスしてきたときに
// TODOリストを返す
app.get("/api/v1/list", (req, res) => {
  // JSONを送信する
  res.json(todoList);
});

// http://localhost:3000/api/v1/add にデータを送信してきたときに
// TODOリストに項目を追加する
app.post("/api/v1/add", (req, res) => {
  // クライアントからの送信データを取得する
  const todoData = req.body;
  const todoTitle = todoData.title;

  // ユニークIDを生成する
  const id = uuidv4();

  // TODO項目を作る
  const todoItem = {
    id,
    title: todoTitle,
    done: false,
  };

  // TODOリストに項目を追加する
  todoList.push(todoItem);

  // コンソールに出力する
  console.log("Add: " + JSON.stringify(todoItem));

  // 追加した項目をクライアントに返す
  res.json(todoItem);
});

app.delete("/api/v1/item/:id", (req, res) => {
  // URLの:idと同じIDを持つ項目を検索
  const index = todoList.findIndex((item) => item.id === req.params.id);

  // 項目が見つかった場合
  if (index >= 0) {
    const deleted = todoList.splice(index, 1); // indexの位置にある項目を削除
    console.log("Delete: " + JSON.stringify(deleted[0]));
  }

  // ステータスコード200:OKを送信
  res.sendStatus(200);
});

// DELETEとほぼ同じ
app.put("/api/v1/item/:id", (req, res) => {
  // URLの:idと同じIDを持つ項目を検索
  const index = todoList.findIndex((item) => item.id === req.params.id);

  // 項目が見つかった場合
  if (index >= 0) {
    const item = todoList[index];
    if (req.body.done) {
      item.done = req.body.done === "true";
    }
    console.log("Edit: " + JSON.stringify(item));
  }

  // ステータスコード200:OKを送信
  res.sendStatus(200);
});

// ポート3000でサーバを立てる
app.listen(3000, () => console.log("Listening on port 3000"));
