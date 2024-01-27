//import statements as common js
const express = require("express");
const cors = require("cors");
const schema = require("./schema");
const userroute = require("./routes/user.route");

const app = express();
app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/", userroute);

// app.get("/users", (req, res) => {
//   db.query("SELECT * FROM users", (err, resp) => {
//     if (err) {
//       res.status(400).json(err);
//       console.log(err);
//     } else {
//       res.status(200).json(resp);
//     }
//   });
// });

//close the database connection after the db.query gets over

// app.post("/login", (req, res) => {
//   console.log(req.body);
//   const { email, password } = req.body;
//   connection();
//   db.query(
//     "SELECT * FROM users WHERE email = ? AND password = ?",
//     [email, password],
//     (err, resp) => {
//       if (err) {
//         res.status(400).json(err);
//       } else {
//         if (resp.length === 1) {
//           res.status(200).json(resp);
//         } else {
//           res.json(["no user found"]);
//         }
//       }
//     }
//   );
// });

// app.post("/register", (req, res) => {
//   const { email, password, name } = req.body;
//   const userid = uuid.v4();
//   console.log(email, password);
//   connection();
//   db.query(
//     "INSERT INTO users (userid, email, password, name) VALUES (?,?,?,?)",
//     [userid, email, password, name],
//     (err, resp) => {
//       if (err) {
//         console.log(err);
//         res.status(400).json(err);
//       } else {
//         console.log(resp);
//         res.status(200).json(resp);
//       }
//     }
//   );
// });

// app.get("/getentry", async (req, res) => {
//   const { userid, date } = req.query;
//   connection();
//   // console.log(db);
//   db.query(
//     "SELECT data FROM pages WHERE userid=? AND date=?",
//     [userid, date],
//     (err, resp) => {
//       if (err) {
//         console.log(err);
//         res.json(err).status(400);
//       } else {
//         if (resp.length === 0) {
//           res.status(400).json("No data found");
//         } else {
//           var bytes = CryptoJS.AES.decrypt(resp[0].data, "213ec9f8-7b83");
//           var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//           res.status(200).json(decryptedData);
//         }
//       }
//     }
//   );
// });

// app.post("/addentry", async (req, res) => {
//   const { userid, date, content } = req.body;
//   const entryid = uuid.v4();

//   console.log(userid, date, content);
//   var ciphertext = "";
//   var ciphertext = CryptoJS.AES.encrypt(
//     JSON.stringify(content),
//     "213ec9f8-7b83"
//   ).toString();
//   connection();
//   db.query(
//     "SELECT data FROM pages WHERE userid=? AND date=?",
//     [userid, date],
//     (err, resp) => {
//       if (err) {
//         console.log(err);
//         res.status(400).json(err);
//       } else {
//         console.log(resp.length);
//         if (resp.length === 0) {
//           //query for insert
//           const data = db.query(
//             "INSERT INTO pages (pageid, userid, data, date) VALUES (?,?,?,?)",
//             [entryid, userid, ciphertext, date],
//             (error, resp) => {
//               if (error) {
//                 console.log(error);
//                 res.status(400).json(error);
//               } else {
//                 console.log(resp);
//                 res.status(200).json(resp);
//               }
//             }
//           );
//         } else {
//           db.query(
//             "UPDATE pages SET data = ? WHERE userid = ? AND Date = ?",
//             [ciphertext, userid, date],
//             (error, resp) => {
//               if (err) {
//                 console.log(error);
//                 res.status(400).json(error);
//               } else {
//                 console.log("updated successfully");
//                 res.status(200).json(resp);
//               }
//             }
//           );
//         }
//       }
//     }
//   );
// });

// app.post("/updateentry", (req, res) => {
//   const { userid, date, content } = req.body;
//   console.log(userid, date, content);
//   var ciphertext = "";
//   var ciphertext = CryptoJS.AES.encrypt(
//     JSON.stringify(content),
//     "213ec9f8-7b83"
//   ).toString();
//   connection();
// });

// var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123')
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
// console.log(decryptedData)

app.listen(8080, "0.0.0.0", () => {
  schema();
  console.log("Server is running on http://0.0.0.0:8080");
});
