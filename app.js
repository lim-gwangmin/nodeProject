require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const https = require("https");
const fs = require("fs");

const app = express();
const port = process.env.PORT;
// const port = 3000;

const userController = require("./controller/userController");
const expressLayouts = require('express-ejs-layouts');
const { TargetWorks } = require("./models/Users.js");
const { LoggerLevel } = require("mongodb");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);

// const options = { // letsencrypt로 받은 인증서 경로를 입력
//    ca: fs.readFileSync('/etc/letsencrypt/live/life.codexbridge.co.kr/fullchain.pem'),
//    key: fs.readFileSync('/etc/letsencrypt/live/life.codexbridge.co.kr/privkey.pem'),
//    cert: fs.readFileSync('/etc/letsencrypt/live/life.codexbridge.co.kr/cert.pem')
// };

// // http.createServer(app).listen(port);
// https.createServer(options, app).listen(443);
/**
 * !정적파일 로드
 * @root 경로에 express 가상 경로가 붙어 정적 파일 경우 경로 설정 해줘야함
 * */ 
app.use('/css', express.static(__dirname + '/css'));
app.use('/assets/', express.static(__dirname + '/assets/'));
app.use('/public/', express.static(__dirname + '/public/'));
app.use('/', express.static(__dirname + '/'));

app.set('layout', 'partials/layout');
app.set("view engine", "ejs");

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Cluster0",
  })
  .then(() => {
    console.log("we connected mongo");
  })
  .catch((err) => {
    console.log(err);
  });


app.get("/", userController.getAllUsers);


app.put("/api/checked/:id", async (req, res) => {
   try {
      const { params, body } = req;
      const target = await TargetWorks.findOne(params);
      
      if (target) {
         target.checked = !target.checked;

         await target.save();

         res
         .status(200)
         .json({message: '변경되었습니다.', result: true, data: target});
      } else {
         res
         .status(404)
         .send({message: '404!!', result: false});
      };

   } catch ( err ) {
      console.log(err)
   }
});

app.listen(port, () => {
  console.log(`Server is running on  ${port}`);
});