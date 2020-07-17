const passport=require('passport');//modulo per oauth
const GoogleStrategy = require('passport-google-oauth20').Strategy;//utilizzo la strategia google-oauth2.0
                                                                   //di passport.

passport.serializeUser(function(user, done) { //serializeUser determina quali dati dell'oggetto utente 
    done(null, user.id);                      //devono essere archiviati nella sessione. Il risultato del 
  });                                         //metodo serializeUser è allegato alla sessione come req.session.passport.user = {}
                                              //Noi non abbiamo utilizzato req.session.passport.user ma
                                              //abbiamo utilizzato direttamente req.session.user.
             
passport.deserializeUser(function(id, done) { //Il primo argomento di deserializeUser corrisponde 
    done(err, user);                          //alla chiave dell'oggetto utente che è stata data alla 
});                                           //funzione done. Quindi l'intero oggetto viene recuperato
                                              //con l'aiuto di quella chiave. Quella chiave qui è l'id utente. 
                                              //In deserializeUser tale chiave è abbinata all'array / database in memoria o a qualsiasi risorsa di dati.
require("dotenv").config();

//La strategia richiede un callback di verifica, che riceve il token di accesso e il token 
//di aggiornamento opzionale, nonché un profilo che contiene il profilo Google dell'utente 
//autenticato. Il callback di verifica deve chiamare done fornendo un utente per completare 
//l'autenticazione.
passport.use(new GoogleStrategy({   //passport utilizza la strategia google oauth 2.0 
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8888/google/callback" //url di rindirizzamento una volta fatto il login
  },
  function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
));