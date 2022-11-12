require("dotenv").config();

const express = require("express");
const app = express();
const { ROLE } = require("./data");
const { authUser, authRole } = require("./basicAuth");
const projectRouter = require("./routes/projects");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(setUser);
app.use("/projects", projectRouter);

users = [];

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      password: hashedPassword,
      id: req.body.id,
      role: req.body.role,
    };
    users.push(user);
    console.log(users);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.get("/dashboard", authUser, async (req, res) => {
  // Authenticate User
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      // Authenticate User
      const a_user = { name: user.name };
      const accessToken = jwt.sign(a_user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
      res.send("Dashboard Page");
    } else {
      res.status(401).send("Wrong password");
    }
  } catch {
    res.status(500).send();
  }
});

app.get("/admin", authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send("Admin Page");
});

function setUser(req, res, next) {
  const name = req.body.name;
  if (name) {
    req.user = users.find((user) => user.name === name);
  }
  console.log(req.body.name);
  next();
}

app.listen(3000);

module.exports = {
  users: users,
};
