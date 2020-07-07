
require("dotenv").config(); //ancora non so come usare .env nei file ejs
var express = require('express');   
var bodyParser = require("body-parser");  

//npm install express   ---->   modulo che ci permette di effettuare chiamate http 
//npm install body-parser  ---->  modulo che permette il passaggio di parametri dal client al server. lo usiamo per la gestione dei post dalle form 
//npm install ejs   -->  installiamo EJS che ci permetterà di creare i template(nella cartella view) ai quali potremo anche passare dati dinamicamente.
//                         per adesso i dati che passeremo saranno variabili dichiarate qui, poi dovremo implementare un DB per i nosti dati.


var app = express();

app.set('view engine', 'ejs');    //usiamo il metodo set di app (variabile express()) per settare le view engine
                                  // e come secondo parametro gli segnaliamo che le nostre view saranno file ejs


//middleware per gestire richieste a file statici e poter quindi usare fogli di stile e altri file esterni e parametri tramite post

app.use(bodyParser.urlencoded({ extended: false }));  //usato per permettere il passagio dei parametri tramite post
app.use('/assets',express.static('assets')) //funzione static di express fatta apposta per gestire i file statici
//in questo modo quando riceviamo una richiesta ad un url /assets/..   verà mappata alla cartella asstes




//se usiamo app.set come visto sopra non c'è piu bisogno di __dirname.  i file che gli passeremo li andrà a cercare direttamente nella cartella views di default
app.get('/', function(req, res){      //get alla root
  res.render("index")  
});


app.get('/contattaci', function(req, res){      //get alla pagina contattaci
    res.render("contattaci")  
});


app.get('/api', function(req, res){      //get alla pagina contattaci
    res.render("api")  
    
  });

  app.get('/chat', function(req, res){      //get alla pagina contattaci
    res.render("chat")  
  });
  




//parte per la gestione della CHAT:

WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 8080
    });

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    
    wss.on('connection', function(ws) {
        console.log('connected');
        ws.on('message', function(msg) {
            data = JSON.parse(msg);
            if (data.message) wss.broadcast('<strong>' + data.name + '</strong>: ' + data.message);
        });
    });








//NOTA:  nodemail modulo che potrei usare in futuro per mandare le mail nella pagina contattaci

var server = app.listen(8888, function () {//far girare un server con express, gli passo la porta dove ascoltare e una funzione che va scritta cosi credo in ogni caso
    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Example app listening at http://%s:%s', host, port);
  });

