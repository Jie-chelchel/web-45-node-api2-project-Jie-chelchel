const express = require("express");
const router = express.Router();
const Posts = require("./posts-model");

router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => res.status(200).json(posts))
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert(newPost)
      .then((post) => res.status(201).json({ ...req.body, ...post }))
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const change = req.body;
  if (!change.title || !change.contents) {
    return res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  }

  Posts.findById(id)
    .then((selectedPost) => {
      if (!selectedPost) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        // console.log(id, change);
        return Posts.update(id, change);
      }
    })
    .then((canUpdate) => {
      if (canUpdate) {
        res.status(201).json({ ...change, id: +id });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then((selectedPost) => {
      if (!selectedPost) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        // console.log(id, change);
        Posts.remove(id).then((canDelete) => {
          if (canDelete) {
            res.json(selectedPost);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "The post could not be removed" });
    });
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then((selectedPost) => {
      if (!selectedPost) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        Posts.findPostComments(id).then((data) => res.json(data));
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});
module.exports = router;
