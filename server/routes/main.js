const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/**
 * GET /
 * HOME
 */
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    let perPage = 6;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJS Blog",
//     description: "Simple Blog created with NodeJS and Express."
//   };
//   try {
//       const data = await Post.find();
//       console.log("Data retrieved:", data);
//       res.render('index', { ...locals, data });
//     } catch (error) {
//       console.error("Error fetching posts", error);
//       res.status(500).send("Unable to fetch posts. Please try again later.");
//     }
// });
// function insertPostData() {
//   Post.insertMany([
//     {
//       title: "Building a Blog",
//       body: "This is the body text",
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments...",
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries.",
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications.",
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js.",
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications.",
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations.",
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers.",
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic.",
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan.",
//     }
//   ]).then(docs => {
//     console.log("Posts inserted", docs);
//   }).catch(err => {
//     console.error("Error inserting posts", err);
//   });
// }
// insertPostData();

/**
 * GET /
 * Post :id
 */
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJS and Express.",
    };

    console.log("Data retrieved:", data);
    res.render("post", { ...locals, data });
  } catch (error) {
    console.error("Error fetching posts", error);
    res.status(500).send("Unable to fetch posts. Please try again later.");
  }
});

/**
 * POS /
 * Post - searchItem
 */

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJS and Express.",
    };
    let searchTerm = req.body.searchTerm;
    if (!searchTerm) {
      console.error("Search term is undefined.");
      res.status(400).send("Search term is required.");
      return;
    }
    const searchNoSpeacialChar = searchTerm.replace(/[^\w\s]/gi, "");
    
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpeacialChar, "i")} },
        { body: { $regex: new RegExp(searchNoSpeacialChar, "i" )} },
      ],
    });

    res.render("search", {
      data,
      locals
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
