const passport=require('passport');//modulo per oauth
const GoogleStrategy = require('passport-google-oauth20').Strategy;//utilizzo la strategia google-oauth2.0
                                                                   //di passport. Passport utilizza diverse strategie a seconda del provider, devo specificare quella per google

passport.serializeUser(function(user, done) { //serializeUser determina quali dati dell'oggetto utente 
    done(null, user.id);                      //devono essere archiviati nella sessione(in questo caso solo l'ID 
                                              //dell'utente). Il risultato del metodo serializeUser
  });                                         // è allegato alla sessione come req.session.passport.user = {}
                                              //Noi non abbiamo utilizzato req.session.passport.user ma
                                              //abbiamo utilizzato direttamente req.session.user.
             
passport.deserializeUser(function(id, done) { //serve a recuperare un utente in base a un dato passatogli (è utile piu 
                                              //nei casi in cui c'è anche un database, noi quindi non la usiamo mai).             
                                              //Il primo argomento di deserializeUser corrisponde 
    done(err, user);                          //alla chiave dell'oggetto utente che è stata data alla 
});                                           //funzione done. Quindi l'intero oggetto viene recuperato
                                              //con l'aiuto di quella chiave. Quella chiave qui è l'id utente. 
                                              //In deserializeUser tale chiave è abbinata all'array / database in memoria o a qualsiasi risorsa di dati.
require("dotenv").config(); //per usare il .env

//La strategia richiede una callback di verifica, che riceve il token di accesso e il token 
//di aggiornamento opzionale, nonché un profilo che contiene il profilo Google dell'utente 
//autenticato. Il callback di verifica deve chiamare done fornendo un utente per completare 
//l'autenticazione.
passport.use(new GoogleStrategy({   //passport utilizza la strategia google oauth 2.0 
    clientID: process.env.CLIENT_ID,           //settiamo l'oggetto googleStrategy(strategia google) con i dati del progetto creato su developer di google
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8888/google/callback" //questa callback deve essere uguale alla callback definita nella cloud platform(sul progeto developers di google)
                                                         //url di rindirizzamento una volta fatto il login
  },
  function(accessToken, refreshToken, profile, done) {
      return done(null, profile); //done completa l'autenticazione, gli passiamo il profilo dell'utente
  }
));