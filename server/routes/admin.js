const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

const adminLayout = "../views/layouts/admin";
/**
 * GET /
 * Admin - Login page
 */

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJS and Express.",
    };
    res.render("admin/index", { ...locals, layout: adminLayout });
  } catch (error) {
    console.error("Error fetching posts", error);
    res.status(500).send("Unable to fetch posts. Please try again later.");
  }
});

/**
 * POST
 * Admin - Check login
 */
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (req.body.username === "admin" && req.body.password === "password") {
      res.send("You are logged in");
    } else {
      res.send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error fetching posts", error);
    res.status(500).send("Unable to fetch posts. Please try again later.");
  }
});

module.exports = router;
