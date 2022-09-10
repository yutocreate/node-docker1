const fs = require("fs");
const express = require("express");
const app  = express();
const port = 3000;
const file = "data.txt";

app.get("/", (req, res)=>{
  //------------------------
  // 読み込み
  //------------------------
  fs.readFile(file, (err, data)=>{
    const count = Number(data);

    if( err ){
      res.send(`エラーが発生しました ${err}`);
      return(false);
    }

    //------------------------
    // 書き込み
    //------------------------
    fs.writeFile(file, String(count+1), (err)=>{
      if( err ){
        res.send(`エラーが発生しました ${err}`);
        return(false);
      }

      res.send(`あなたは${count}人目のお客様です`);
    })

  });
});

// サーバを起動
app.listen(port, ()=>{
  console.log(`Running at http://localhost:${port}/`);
});