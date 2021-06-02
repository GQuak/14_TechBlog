const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

// var mysql2 = require('mysql2');
// var connection = mysql2.createConnection(process.env.JAWSDB_URL);

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// sequelize.sync({ force: false }).then(() => {
//   app.listen(PORT, () => console.log('Now listening'));
// });
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(PORT, () => console.log('Now listening'));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    app.listen(PORT, () => console.log('Now listening, no DB'));
  });
