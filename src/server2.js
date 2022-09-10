const fs = require("fs");
const express = require("express");
const app  = express();
const port = 3000;
const file = "data.txt";

// ルーティング
app.get("/aa", (req, res)=>{
  try{
    let count = fs.readFileSync(file);          // 読み込み
    fs.writeFileSync(file, (Number(count)+1));  // 書き込み
    res.send(`あなたは${count}人目のお客様です`);
  }
  catch(e){
    res.send(`エラーが発生しました ${e.message}`);
  }
});

// サーバを起動
app.listen(port, ()=>{
  console.log(`Running at http://localhost:${port}/`);
});