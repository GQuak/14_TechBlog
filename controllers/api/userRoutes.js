const router = require('express').Router();
const { User } = require('../../models');

// using a POST request to add a new user
// /api/user/
router.post('/', async (req, res) => {
  try {
    const addUser = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = addUser.id;
      req.session.logged_in = true;

      res.status(200).json(addUser);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// using a POST request to create a new session upon logging into a user account
// /api/user/login
router.post('/login', async (req, res) => {
  console.log('start post');
  try {
    const loginData = await User.findOne({ where: { email: req.body.email } });
    console.log('email');
    console.log(req.body.email);
    if (!loginData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await loginData.checkPassword(req.body.password);
    console.log('password');
    console.log(validPassword);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = loginData.id;
      req.session.logged_in = true;

      res.json({ user: loginData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log('email error: ' + req.body.email);
    res.status(404).json(err);
  }
});

// using a POST request to end the session upon logging out
// /api/user/logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
