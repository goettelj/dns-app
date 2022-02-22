'use strict';

import express from 'express';
import dgram from 'dgram'

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('<h1>NYU Data Communications and Networks Lab 3 - DNS Application</h1>');
});

app.get('/fibonacci', (req, res) => {
    
    // validate correct params
    const query = req.query;
    const number = parseInt(req.query.number);

    if ( ! Number.isInteger(number) ){
        res.status(400);
        res.send(`<h2>Invalid Number sent: '${req.query.number}'</h2>`);
        return;
    }
    
    const hostname = req.query.hostname;
    const asIp = req.query.as_ip;
    const asPort = req.query.as_port;

    // DNS Stuff
    const client = dgram.createSocket("udp4");
    const message = `TYPE=A\nNAME=${hostname}\n`;
    client.send(message, asPort, asIp, (err) => {
      if (err) {
        console.log(`error sending query to Authoritative Server: ${err}`);
        res.status(400);
        res.send(`Problem sending message to as_ip: ${asIp}, as_port: ${asPort}`);
        client.close();
        return;
      }
      res.status(201);
  
      client.close();
    });

    //TODO HTTP call to Fibonacci Server
    res.send("Successfully sent DNS query.  Now how do I get a response??");
    
});

app.listen(PORT, HOST);
console.log(`User Server running on http://${HOST}:${PORT}`);