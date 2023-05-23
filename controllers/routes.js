const { v4: uuidv4, v4 } = require("uuid");
const router = require("express").Router();
const express = require("express");
const fs = require("fs/promises");
const db = require("../../unit5-part1/db");

// all endpoints for your router go
// in this file here

router.get("/", (req, res) => {
  res.send(`Yes, I am listening here too`);
});

router.get("/all", async (req, res) => {
  res.json(await readBlog());
});

//getting specific item using the post_id number
router.get("/:id", (req, res) => {
  const item = db.find((item) => item.post_id === req.params.id);

  res.json(item);
});

router.post("/new", async (req, res) => {
  //getting object from postman
  const { item, title, author, body } = req.body;

  const db = await readBlog();
  // making new object to send back to database
  const blogPost = {
    //uuidv4 was installed to give random ids to new posts
    post_id: uuidv4(),
    title: title,
    author: author,
    body: body,
    item: item,
  };

  db.push(blogPost);

  await writeBlog(db);

  res.json({
    message: "Added post To Database",
    blogPost,
  });
});

//Updating an existing entry
router.put("/:id", async (req, res) => {
  const dbName = `posts.json`;
  const data = await fs.readFile(dbName, "utf8");
  const db = JSON.parse(data);

  const postIndex = db.findIndex((post) => post.post_id === req.params.id);

  const post = db[postIndex];

  //breakdown of what can be modified and where the update will be
  //pushed to
  if (req.body.post_id !== undefined) {
    post.post_id = req.body.post_id;
  }
  if (req.body.title !== undefined) {
    post.title = req.body.title;
  }
  if (req.body.author !== undefined) {
    post.author = req.body.author;
  }
  if (req.body.body !== undefined) {
    post.body = req.body.body;
  }
  if (req.body.item !== undefined) {
    post.item = req.body.item;
  }

  await fs.writeFile(dbName, JSON.stringify(db), "utf8");

  res.json({
    message: "Update successful",
    blogPost: post,
  });
});

//Deleting specific posts using post_id
router.delete("/:id", async (req, res) => {
  const db = await readBlog();
  const index = db.findIndex(
    (post) => parseInt(post.post_id) === parseInt(req.params.id)
  );

  const deleted = db.splice(index, 1);
  await writeBlog(db);
  res.json({
    message: "Item Was Deleted Successfully!",
    deletedPost: deleted,
  });
});

//Deleting specific posts using author
router.delete("/:id", async (req, res) => {
  const db = await readBlog();
  const index = db.findIndex(
    (post) => parseInt(post.author) === parseInt(req.params.id)
  );

  const deleted = db.splice(index, 1);
  await writeBlog(db);
  res.json({
    message: "Item Was Deleted Successfully!",
    deletedPost: deleted,
  });
});

module.exports = router;

//fs functions
async function readDb(dbname) {
  const result = await fs.readFile(
    `${dbname}.json`, // first arg: name of file to read
    "utf8"
  );
  // return the array corresponding to dbname
  return JSON.parse(result);
}

const readBlog = async () => await readDb("posts");

async function writeDb(dbname, data) {
  await fs.writeFile(`${dbname}.json`, JSON.stringify(data), "utf8");
}

const writeBlog = async (data) => await writeDb("posts", data);

// Eli had me change the file "blog.js" to "posts.js" for some reason when walking
//me through some code. Just to let you know!
