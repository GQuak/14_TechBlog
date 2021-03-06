const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// using a GET request to render the homepage with all existing blog posts
// /
router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        { model: Comment },
      ],
    });
    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    console.log(blogs);
    // Pass serialized data and session flag into template
    res.render('homepage', {
      logged_in: req.session.logged_in,
      blogs,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// using GET request to render the dashboard, withAuth middleware verifies users login information before rendering the page
// /dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // find logged in user based on session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });
    // serialize data so template can read it
    const user = userData.get({ plain: true });
    // pass serialized data and session flag into template
    res.render('dashboard', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// using GET request to display the login page
// /login
router.get('/login', async (req, res) => {
  // if user already logged in, redirect request to another route
  if (req.session.logged_in) {
    res.redirect('dashboard');
    return;
  }
  res.render('login');
});

// using GET request to display a signup page
// /signup
router.get('/signup', async (req, res) => {
  // if user already logged in, redirect request to another route
  if (req.session.logged_in) {
    res.redirect('dashboard');
    return;
  }
  res.render('signup');
});

// using GET request to display a single comment by its ID
// /comment/:id
router.get('/comment/:id', async (req, res) => {
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

// using GET request to display a single post by its ID
// /blog/:id
router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [{ model: User }, { model: Comment }],
    });

    const blog = blogData.get({ plain: true });

    res.render('blog', {
      ...blog,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// using a GET request to access a single blog post's data to edit
// /edit/:id
router.get('/edit/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [{ model: User }, { model: Comment }],
    });

    const blog = blogData.get({ plain: true });

    res.render('edit', {
      ...blog,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
