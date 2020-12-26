const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const port = process.env.port || 5000;
const db = require('./database');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('req-flash');

const publicDirectory = path.join(__dirname, './public');

app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cookieParser());
app.use(
  session({
    secret: 'ohthisisnodemysql',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash())

app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
  })
);

app.set('view engine', 'hbs');

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Mysql connected');
  }
});

// define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
