const express = require('express');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

mongoose.connect('mongodb://mongo:27017/voting', { useNewUrlParser: true, useUnifiedTopology: true });

const voteSchema = new mongoose.Schema({
  candidateId: Number,
  voterAddress: String,
});

const Vote = mongoose.model('Vote', voteSchema);

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));

app.use(passport.initialize());
app.use(express.json());

app.post('/vote', async (req, res) => {
  const { candidateId, voterAddress } = req.body;

  const vote = new Vote({ candidateId, voterAddress });
  await vote.save();

  res.send('Vote recorded');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
