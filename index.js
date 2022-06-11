require("dotenv").config();

const express = require("express");
const { send, status } = require("express/lib/response");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.post("/users", (req, res) => {
  const { name, age, city } = req.body;
  db.query(
    "INSERT INTO users(name, age,city) VALUES(?,?,?)",
    [name, age, city],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.patch("/users/:id", (req, res) => {
  const id = req.params.id;

  const newUser = req.body;
  const index = userList.findIndex((user) => user.id == id);
  userList[index] = newUser;
  return res.json(userList);
});

/*app.patch("/users", (req, res) => {
    userList = userList.map((user) => {
        if (user.name === req.body.name) {
            return req.body;
        }
        return user;
    }
    );
    return res.json(userList);
}
);*/

app.delete("/users/:id", (req, res) => {
  //grab id for user to delete
  const id = req.params.id;
  //error if id is not a number

  //find index of user to delete
  const index = userList.findIndex((user) => user.id == id);
  //delete user
  userList.splice(index, 1);
  //send userList to client
  return res.json(userList);
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
