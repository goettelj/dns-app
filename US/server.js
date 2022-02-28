"use strict";

import express from "express";
import dgram from "dgram";
import axios from "axios";
import { dnsMessageToJson } from "./utils.js"; 

// Constants
const PORT = 8080;
const HOST = "127.0.0.1";

// App
const app = express();
app.get("/", (req, res) => {
  res.send(
    "<h1>NYU Data Communications and Networks Lab 3 - DNS Application</h1>"
  );
});

app.get("/fibonacci", (req, res) => {
  // validate correct params
  const query = req.query;
  const number = parseInt(req.query.number);

  if (!Number.isInteger(number)) {
    res.status(400);
    res.send(`<h2>Invalid Number sent: '${req.query.number}'</h2>`);
    return;
  }

  const { hostname, as_ip: asIp, as_port: asPort, fs_port: fsPort } = req.query;

  // dns query
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
  });

  // dns query response
  client.on("message", (msg, rinfo) => {
    console.log(`Received: ${msg} from: ${rinfo.address}:${rinfo.port}`);
    client.close();

    if (msg == "NOT_FOUND"){
      res.status(404);
      res.send(`Could not find ${message} in DNS Authoritative Server.  Ensure this domain has been registered.`);
      return;
    }

    // parse ip address and port from response
    const msgObj = dnsMessageToJson(msg);
    const ip = msgObj.value;
    // make http request to fibonacci server
    const url = `http://${ip}:${fsPort}/fibonacci?number=${number}`;
    console.log(`calling url: ${url}`);
    axios.get(url)
      .then(fsRes => {
        res.status(200);
        res.send(fsRes.data);
        return;
      })
      .catch(error => {
        console.error(`Error calling: ${url}: ${error.message}`);
      });
  });
});

app.listen(PORT);
console.log(`User Server running on http://${HOST}:${PORT}`);
