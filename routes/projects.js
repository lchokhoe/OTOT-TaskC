require("dotenv").config();

const { users } = require("../server");
const express = require("express");
const { authUser } = require("../basicAuth");
const router = express.Router();
const { projects } = require("../data");
const jwt = require("jsonwebtoken");
const {
  canViewProject,
  canDeleteProject,
  scopedProjects,
} = require("../permissions/project");

router.get("/", authUser, authenticateToken, (req, res) => {
  res.json(scopedProjects(req.user, projects));
});

router.get(
  "/:projectId",
  setProject,
  authenticateToken,
  authGetProject,
  (req, res) => {
    res.json(req.project);
  }
);

router.delete(
  "/:projectId",
  setProject,
  authUser,
  authenticateToken,
  authDeleteProject,
  (req, res) => {
    res.send("Deleted Project");
  }
);

function setProject(req, res, next) {
  const projectId = parseInt(req.params.projectId);
  req.project = projects.find((project) => project.id === projectId);

  if (req.project == null) {
    console("Project not found");
    res.status(404);
    return res.send("Project not found");
  }
  next();
}

function authGetProject(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
    res.status(401);
    return res.send("Not Allowed");
  }
  next();
}

function authDeleteProject(req, res, next) {
  if (!canDeleteProject(req.user, req.project)) {
    res.status(401);
    return res.send("Not Allowed");
  }
  next();
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(403);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
