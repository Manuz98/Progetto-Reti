require("dotenv").config();  //modulo per leggere variabili dal .env
require('./passport-setup'); //richiamo il file passport-setup.js
var express = require('express'); //modulo che ci permette di effettuare chiamate http  
var bodyParser = require("body-parser");//modulo che permette il passaggio di parametri dal client al server. lo usiamo per la gestione dei post dalle form  
const passport=require('passport');//modulo per oauth
const cookieSession = require('cookie-session');
const swaggerUi=require('swagger-ui-express'); //modulo per la documentazione swagger
const swaggerDocument=require('./swagger.json');//richiamo il file swagger.json
//npm install ejs   -->  installiamo EJS che ci permetterà di creare i template(nella cartella view) ai quali potremo anche passare dati dinamicamente.
//                       per adesso i dati che passeremo saranno variabili dichiarate qui.

var app = express();

app.set('view engine', 'ejs');    //usiamo il metodo set di app (variabile express()) per settare le view engine
                                  //e come secondo parametro gli segnaliamo che le nostre view saranno file ejs


//middleware per gestire richieste a file statici e poter quindi usare fogli di stile e altri file esterni e parametri tramite post

app.use(bodyParser.urlencoded({ extended: false }));//usato per permettere il passagio dei parametri tramite post
app.use('/assets',express.static('assets')) //funzione static di express fatta apposta per gestire i file statici
                                            //in questo modo quando riceviamo una richiesta ad un url /assets/..   verà mappata alla cartella asstes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));//utilizziamo http://localhost:8888/api-docs per visionare la documentazione

app.use(passport.initialize()); //Nelle app basate su express il middleware passport.initialize() è necessario per inizializzare Passport(passport = framework javascript che implementa oauth)
app.use(passport.session());    //La nostra app utilizza sessioni di accesso persistenti, è necessario utilizzare anche il middleware passport.session().                                         
//I middleware sono funzioni che hanno accesso all'oggetto richiesta (req), all'oggetto risposta (res) e alla successiva funzione middleware nel ciclo richiesta-risposta dell'applicazione.

app.use(cookieSession({     //cookie-session può essere utilizzata per memorizzare una sessione "leggera".
    name: 'session',        //Memorizza solo un identificatore di sessione sul client all'interno di un cookie
    keys: ['key1', 'key2']  //e archivia i dati della sessione sul server. Se quindi usciamo dal sito mantenendo aperto il browser,
}));                        //possiamo rientrare nel sito senza doverci loggare di nuovo.

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); //sessione express con opzioni
//Crea un middleware di sessione con le opzioni fornite. I dati di sessione non vengono salvati 
//nel cookie stesso, ma solo nell'ID sessione. I dati della sessione sono memorizzati sul lato server.
//secret è il segreto(chiave) utilizzato per firmare il cookie ID sessione. 
//resave:true forza il salvataggio della sessione nell'archivio sessioni, anche se la sessione non è mai stata modificata durante la richiesta.
//saveUninitialized:true forza una sessione "non inizializzata" a essere salvata. Una sessione non è inizializzata quando è nuova ma non modificata.


//se usiamo app.set come visto sopra non c'è piu bisogno di __dirname.  i file che gli passeremo li andrà a cercare direttamente nella cartella views di default
app.get('/',function(req, res){      //get alla root
  if(req.session.user){              //controlla se esiste una sessione
    res.redirect("index")
  }   
  res.render("login",{user:req.session.user}) //user, variabile inizializzata con i dati dell utente che usiamo in login.ejs passata con render
});                                            

app.get('/index',function(req, res){      //get alla index
    if(!req.session.user){
        res.redirect("/")
    }
    res.render("index",{user:req.session.user}) 
});

app.get('/contattaci', function(req, res){      //get alla pagina contattaci
    if(!req.session.user){
       res.redirect("/")
    }
    res.render("contattaci",{user:req.session.user})  
});


app.get('/mappa', function(req, res){      //get alla pagina contattaci
    if(!req.session.user){
        res.redirect("/")
     }
    res.render("mappa",{user:req.session.user})  
 });

app.get('/chat', function(req, res){      //get alla pagina contattaci
    if(!req.session.user){
        res.redirect("/")
     }
    res.render("chat",{user:req.session.user})  
});

app.get('/google', passport.authenticate('google', { scope: ['profile','email'] })); //funzione chiamata una volta cliccato il bottone signin che ci porta alla pagina di log in di google. Autenticate è una funzione del passport che ci permette di autenticarci. Gli passiamo il provider e i dati a cui vogliamo accedere

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), //funzione chiamata un volta fatto il login, se qualcosa va storto
  function(req, res) {                                                                //vengo rimandato al pagina iniziale altrimenti(continua sotto..)
    //Se Autenticazione eseguita, redirect index.
    req.session.user=req.user; //salvo i dati del profilo nella sessione. Quindi vivono finche l'utente rimane loggato
    res.render("index",{user:req.session.user});//vengo rediretto su index passando user (in cui ci sono i dati dell'utente)
});
  
app.get('/logout', function(req,res){ //funzione chiamata nel momento in cui clicco su logout
    req.session.user=null;    //metto a null il campo user all'interno della sessione
    req.logout();             //rimuove la proprieta` req.user e cancella la sessione di login(se presente)
    res.redirect('/');        //vengo rimandato alla pagina iniziale
}); 


//parte per la gestione della CHAT:
//documentazione ed esempi su modulo ws: https://www.npmjs.com/package/ws
const WebSocketServer = require('ws').Server,       //richiedo il modulo che ci permette di creare websocket e creiamo un server
    wss = new WebSocketServer({
        port: 8080                                //il websocket server sarà in ascolto sulla porta 8080
    });

wss.broadcast = function broadcast(data)
{
        wss.clients.forEach(function each(client){     //cicliamo tutti i client connessi al socketserver wss e definiamo una funzione per gestire il loro comportamento
            client.send(data);                       //manda il messaggio a ognuno dei client connessi
        });
    };
    
    wss.on('connection', function(ws){          //resta in attesa di una connessione da parte del browser, definisco la funzione di callback
            console.log('connected');               
            ws.on('message', function(msg) {        //ws = connessione socket stabilita.  quel socket resta in attesa di un messaggio. Definisco una callback per gestire i messaggi
              data = JSON.parse(msg);             //convertiamo il messaggio in un oggetto json          
            if (data.message) wss.broadcast('<strong>' + data.name + '</strong>: ' + data.message);   //mostriamo il nome del client e il messaggio tramite una funzione broadcast del websocket server
        });
    
});






//NOTA:  nodemail modulo che potrei usare in futuro per mandare le mail nella pagina contattaci

var server = app.listen(8888, function () {//far girare un server con express, gli passo la porta dove ascoltare e una funzione che va scritta cosi credo in ogni caso
    var port = server.address().port;
  
    console.log('Example app listening at http://localhost:%s', port);
  });

