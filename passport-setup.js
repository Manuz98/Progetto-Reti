const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) { //serializza l'utente nella sessione una volta fatto il login
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) { //deserializza l'utente dalla sessione una volta fatto il logout
    done(err, user);
});

require("dotenv").config();
passport.use(new GoogleStrategy({   //passport utilizza la strategia google oauth 2.0 
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8888/google/callback" //url di rindirizzamento una volta fatto il login
  },
  function(accessToken, refreshToken, profile, done) { //funzione chiamata se l'autenticazione e` andata a buon fine
      return done(null, profile);
  }
));