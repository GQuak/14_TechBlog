const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');

// using a GET request to return all blog posts
// /api/blog/
router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      // include users and comments with posts
      include: [{ model: User }, { model: Comment }],
    });
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// using a GET request to return a blog post by ID
// /api/blog/:id
router.get('/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [{ model: User }, { model: Comment }],
    });

    const blog = blogData.get({ plain: true });

    res.render('comment', {
      ...blog,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// using a POST request to add a new blog post
// /api/blog
router.post('/', async (req, res) => {
  try {
    const addBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(addBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

// using a DELETE request to remove a blog post by ID
// /api/blog/:id
router.delete('/:id', async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// using a PUT request to edit a blog post by ID
// /api/blog/:id
router.put('/:id', async (req, res) => {
  try {
    const blogData = await Blog.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(blogData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
