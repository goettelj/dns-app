"use strict";

import express from "express";
import dgram from "dgram";
import fibonacci from "./fibonacci.js";

// Constants
const PORT = 9090;
const AS_SERVER_PORT = 53533;
const HOST = "0.0.0.0";

// App
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "<h1>NYU Data Communications and Networks Lab 3 - Fibonacci Server</h1>"
  );
});

app.put("/register", (req, res) => {
  res.send("<h1>Registering the host</h1>");

  const client = dgram.createSocket("udp4");
  client.send("Hello Socket World!", AS_SERVER_PORT, "localhost", (err) => {
    console.log(`error sending message to Authoritative Server: ${err}`)
    client.close();
  });
});

app.listen(PORT, HOST);
console.log(`Fibonacci Server running on http://${HOST}:${PORT}`);
