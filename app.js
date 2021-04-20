const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
dotenv.config({ path: './config.env' });

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Connecting to mongoose database
const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connection is successfull');
  })
  .catch(() => {
    console.log('Cannot connect to database');
  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(err => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login', async function(req, res) {
  const { username } = req.body;
  const { password } = req.body;

  try {
    await User.findOne({ email: username }, function(error, foundUser) {
      if (error) {
        console.log(error);
      } else if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets');
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});
app.listen(3000, () => {
  console.log('App is listening on port 3000');
});
