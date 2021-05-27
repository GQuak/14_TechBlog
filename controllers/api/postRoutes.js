const router = require("express").Router();
const { Post, User, Comment } = require("../../models");

// using a GET request to return all blog posts
// /api/post/
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      // include users and comments with posts
      include: [{ model: User }, { model: Comment }],
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// using a GET request to return a blog post by ID
// /api/post/:id
router.get("/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User }, { model: Comment }],
    });

    const post = postData.get({ plain: true });

    res.render("comment", {
      ...post,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// using a POST request to add a new blog post
// /api/post
router.post("/", async (req, res) => {
  try {
    const addPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(addPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// using a DELETE request to remove a blog post by ID
// /api/post/:id
router.delete("/:id", async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// using a PUT request to edit a blog post by ID
// /api/post/:id
router.put("/:id", async (req, res) => {
  try {
    const postData = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
