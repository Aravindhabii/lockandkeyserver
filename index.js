//import statements as common js
const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
// import userroute from './routes/user.route'
const db = require("./database").db;
const connection = require("./database").connection;
const schema = require("./schema");
const CryptoJS = require("crypto-js");

const app = express();
app.use(cors());
app.use(express.json());

function setCookie(name, uuid, expirationDays) {
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${uuid};${expires};path=/`;
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, resp) => {
    if (err) {
      console.log(err);
    } else {
      res.send(resp);
    }
  });
});

//close the database connection after the db.query gets over

app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  connection();
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, resp) => {
      if (err) {
        res.json(err).status(400);
      } else {
        if (resp.length === 1) {
          res.json(resp).status(200);
        } else {
          res.json(["no user found"]);
        }
      }
    }
  );
  db.end();
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  const userid = uuid.v4();
  console.log(email, password);
  connection();
  db.query(
    "INSERT INTO users (userid, email, password, name) VALUES (?,?,?,?)",
    [userid, email, password, name],
    (err, resp) => {
      if (err) {
        console.log(err);
        res.json(err).status(400);
      } else {
        console.log(resp);
        res.json(resp).status(200);
      }
    }
  );
  db.end();
});

app.post("/addentry", async (req, res) => {
  const { userid, date, content } = req.body;
  const entryid = uuid.v4();

  console.log(userid, date, content);
  var ciphertext = "";
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(content),
    "213ec9f8-7b83"
  ).toString();
  console.log(ciphertext);

  connection();
  const data = db.query(
    "INSERT INTO pages (pageid, userid, data, date) VALUES (?,?,?,?)",
    [entryid, userid, content, date],
    (err, resp) => {
      if (err) {
        console.log(err);
        res.json(err).status(400);
      } else {
        // console.log(resp);
        res.json(resp).status(200);
      }
    }
  );
  db.end();
});

// var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123')
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
// console.log(decryptedData)

app.listen(8080, "0.0.0.0", () => {
  schema();
  console.log("Server is running on http://0.0.0.0:8080");
});
