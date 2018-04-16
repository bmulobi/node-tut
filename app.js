const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path'); // IN BUILT NO INSTALL
const sql = require('mssql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: 'bmulobi',
  password: 'NdU7*kU8&rUu9$',
  server: 'bmulobiserver.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'testdb',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
  },
};

// node creates connection here then caches it
// and passes it everywhere else require('mssql')
sql.connect(config).catch(err => debug(err));

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.set('views', './src/views');
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' },
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use((req, res, next) => {
  debug('my middleware');
  next();
});
app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'views/index.html');
  res.render(
    'index',
    {
      nav,
      title: 'Library',
    },
  );
});

app.listen(port, () => debug(`Listening on port ${chalk.green(port)}`));
