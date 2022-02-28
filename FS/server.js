"use strict";

import express from "express";
import dgram from "dgram";
import fibonacci from "./fibonacci.js";

// Constants
const HOST = "127.0.0.1";
const PORT = 9090;
const DNS_TTL = 10;

// App
const app = express();
app.use(express.json());

app.get("/fibonacci", (req, res) => {
  const number = parseInt(req.query.number);

  // validate input
  if (!Number.isInteger(number)) {
    res.status(400);
    res.send(`${req.query.number} is not an integer.  Please try again.`);
    return;
  }

  const result = fibonacci(number);

  res.send(`<h1>${result}</h1>`);
});

app.put("/register", (req, res) => {
  const client = dgram.createSocket("udp4");

  const body = req.body;
  const hostname = body.hostname;
  const ip = body.ip;
  const authoritativeServerIp = body['as_ip'];
  const authoritativeServerPort = body['as_port'];

  const message = `TYPE=A\nNAME=${hostname}\nVALUE=${ip}\nTTL=${DNS_TTL}`;

  client.send(message, authoritativeServerPort, authoritativeServerIp, (err) => {
    if (err) {
      console.log(`error sending message to Authoritative Server: ${err}`);
      res.status(400);
      res.send(`Problem sending message to as_ip: ${authoritativeServerIp}, as_port: ${authoritativeServerPort}`);
      client.close();
      return;
    }
    res.status(201);
    res.send(`Successfully registered hostname ${hostname}`);

    client.close();
  });
});

app.listen(PORT);
console.log(`Fibonacci Server running on http://${HOST}:${PORT}`);
