require("dotenv").config();
require('./passport-setup');
var express = require('express');   
var bodyParser = require("body-parser");  
const passport=require('passport');
const cookieSession = require('cookie-session');
const swaggerUi=require('swagger-ui-express');
const swaggerDocument=require('./swagger.json');
//npm install express   ---->   modulo che ci permette di effettuare chiamate http 
//npm install body-parser  ---->  modulo che permette il passaggio di parametri dal client al server. lo usiamo per la gestione dei post dalle form 
//npm install ejs   -->  installiamo EJS che ci permetterà di creare i template(nella cartella view) ai quali potremo anche passare dati dinamicamente.
//                         per adesso i dati che passeremo saranno variabili dichiarate qui, poi dovremo implementare un DB per i nosti dati.


var app = express();

app.set('view engine', 'ejs');    //usiamo il metodo set di app (variabile express()) per settare le view engine
                                  //e come secondo parametro gli segnaliamo che le nostre view saranno file ejs


//middleware per gestire richieste a file statici e poter quindi usare fogli di stile e altri file esterni e parametri tramite post

app.use(bodyParser.urlencoded({ extended: false }));  //usato per permettere il passagio dei parametri tramite post
app.use('/assets',express.static('assets')) //funzione static di express fatta apposta per gestire i file statici
//in questo modo quando riceviamo una richiesta ad un url /assets/..   verà mappata alla cartella asstes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(passport.initialize()); //inizializza passport
app.use(passport.session());    //passport session                                         

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); //sessione express con opzioni


//se usiamo app.set come visto sopra non c'è piu bisogno di __dirname.  i file che gli passeremo li andrà a cercare direttamente nella cartella views di default
app.get('/',function(req, res){      //get alla root
  if(req.session.user){
    res.redirect("index")
  }   
  res.render("login",{user:req.session.user}) 
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

app.get('/google', passport.authenticate('google', { scope: ['profile','email'] })); //funzione chiamata una volta cliccato il bottone signin

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), //funzione chiamata un volta fatto il login
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.user=req.user; //salvo i dati del profilo nella sessione
    res.render("index",{user:req.session.user});//vengo rediretto su index passando user (in cui ci sono i dati dell'utente)
});
  
app.get('/logout', function(req,res){ //funzione chiamata nel momento del logout
    res.session=null;
    req.session.user=null;
    req.logout();    
    res.redirect('/'); 
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

