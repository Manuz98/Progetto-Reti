# FitPlace
L'applicazione da la possibilità, ai soli utenti loggati, di localizzarsi e cercare punti d'interesse per quanto rigurda il fitness in un range prestabilito.

## **Requisiti**
- [x] Il servizio REST che implementate (lo chiameremo SERV) deve offrire all'esterno delle API documentate con swagger per esempio
- [x] SERV si deve interfacciare con almeno due servizi REST “esterni”, cioè non su localhost (e.g. google maps)
- [x] Almeno uno dei servizi REST esterni deve essere “commerciale” (es: twitter, google, facebook, pubnub, parse, firbase etc)
- [x] Almeno uno dei servizi REST esterni deve richiedere oauth (e.g. google calendar)
- [x] Si devono usare Websocket e/o AMQP (o simili es MQTT)
- [x] Il progetto deve essere su GIT (GITHUB, GITLAB ...) e documentato don un README che illustri almeno scopo del progetto, tecnologie usate, come installarlo, come far girare i casi di test
- [x] Le API  REST implementate in SERV devono essere documentate su GIT e devono essere validate con un caso di test 

## **Avvio**

- Per installare le dipendenze eseguire `npm install`, verranno lette dal file *package.json* e installate.

- Per avviare il server eseguire `node server`.

- WebSocket(porta 8080) deve essere in esecuzione su _localhost_.

- Collegandosi a http://localhost:8888/api-docs e` possibile vedere la documentazione.

## **REST API**

- Google Api:
  - Geocode: tramite una get passando l'indirizzo del luogo richiesto ci ritorna le sue informazioni dalle quali verranno prese latitudine e longitudine.
  
  - NearbySearch: si effettua una richiesta passando latitudine, longitudine, il tipo di cosa si sta ricercando e il raggio d'interesse per trovare un insieme di luoghi di quel tipo. La ricerca può esser fatta su: 

gym spa park stadium

## **OAUTH**

- Google Login: Implementato con Passport, richiede l'autenticazione e restituisce le informazioni base del proprio profilo(id,nome,email).

## **Funzionalità**

- Web Socket: In `server.js` viene inizializzato il server sulla porta 8080, e si connette al proprio server. Prende il messaggio facendo il parsing JSON e lo inoltra, tramite la funzione `broadcast`, a tutti i client connessi. In `chat.ejs` viene gestito l'inivio del messaggio alla WebSocket tramite la funzione `send` e lo visualizza tramite la funzione `onmessage`. 
