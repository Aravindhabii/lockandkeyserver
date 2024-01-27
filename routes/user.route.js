const express = require("express");
const uuid = require("uuid");
// import userroute from './routes/user.route'
const db = require("../database").db;
const connection = require("../database").connection;
const CryptoJS = require("crypto-js");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

router.route("/").get((req, res) => {
  res.send("Hello World!");
});

router.route("/python").get(async(req, res) => {
  try {
    const dataToSend = { key: 'value' };

    const response = await axios.post('http://localhost:5000/predict', dataToSend, {
      timeout: 5000,
    });

    console.log('Received response from another server:', response.data);

    res.status(200).json({ message: 'POST request to another server successful' });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request to another server timed out:', error.message);
      res.status(504).json({ error: 'Request to another server timed out' });
    } else {
      console.error('Error making POST request to another server:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

router.route("/users").get((req, res) => {
  console.log("users");
  db.query("SELECT * FROM users", (err, resp) => {
    if (err) {
      res.status(400).json(err);
      console.log(err);
    } else {
      res.status(200).json(resp);
    }
  });
});

router.route("/login").post((req, res) => {
  //   console.log(req.body);
  const { email, password } = req.body;
  connection();
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, resp) => {
      if (err) {
        res.status(400).json(err);
      } else {
        if (resp.length === 1) {
          const token = jwt.sign(
            {
              email: resp[0].email,
              userid: resp[0].userid,
            },
            "9acaa36f-395a-46e2-bbf4-629a0e5cc1a2"
          );
          res.status(200).json({
            token: token,
            userid: resp[0].userid,
            name: resp[0].name,
            email: resp[0].email,
          });
        } else {
          res.json(["no user found"]);
        }
      }
    }
  );
});

router.route("/register").post((req, res) => {
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
        res.status(400).json(err);
      } else {
        console.log(resp);
        res.status(200).json(resp);
      }
    }
  );
});

router.route("/getentry").get(verifyToken, (req, res) => {
  jwt.verify(req.token, "9acaa36f-395a-46e2-bbf4-629a0e5cc1a2", (err) => {
    if (err) {
      res.status(403).json("Invalid token");
    } else {
      const { userid, date } = req.query;
      connection();
      // console.log(db);
      db.query(
        "SELECT data FROM pages WHERE userid=? AND date=?",
        [userid, date],
        (err, resp) => {
          if (err) {
            console.log(err);
            res.json(err).status(400);
          } else {
            if (resp.length === 0) {
              res.status(400).json("No data found");
            } else {
              var bytes = CryptoJS.AES.decrypt(resp[0].data, "213ec9f8-7b83");
              var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
              res.status(200).json(decryptedData);
            }
          }
        }
      );
    }
  });
});

router.route("/addentry").post(verifyToken, (req, res) => {
  jwt.verify(req.token, "9acaa36f-395a-46e2-bbf4-629a0e5cc1a2", (err) => {
    if (err) {
      res.status(403).json("Invalid token");
    } else {
      const { userid, date, content } = req.body;
      const entryid = uuid.v4();

      console.log(userid, date, content);
      var ciphertext = "";
      var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(content),
        "213ec9f8-7b83"
      ).toString();
      connection();
      db.query(
        "SELECT data FROM pages WHERE userid=? AND date=?",
        [userid, date],
        (err, resp) => {
          if (err) {
            console.log(err);
            res.status(400).json(err);
          } else {
            console.log(resp.length);
            if (resp.length === 0) {
              //query for insert
              const data = db.query(
                "INSERT INTO pages (pageid, userid, data, date) VALUES (?,?,?,?)",
                [entryid, userid, ciphertext, date],
                (error, resp) => {
                  if (error) {
                    console.log(error);
                    res.status(400).json(error);
                  } else {
                    console.log(resp);
                    res.status(200).json(resp);
                  }
                }
              );
            } else {
              db.query(
                "UPDATE pages SET data = ? WHERE userid = ? AND Date = ?",
                [ciphertext, userid, date],
                (error, resp) => {
                  if (err) {
                    console.log(error);
                    res.status(400).json(error);
                  } else {
                    console.log("updated successfully");
                    res.status(200).json(resp);
                  }
                }
              );
            }
          }
        }
      );
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
    console.log("token not found");
  }
}

module.exports = router;
