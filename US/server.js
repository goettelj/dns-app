'use strict';

import express from 'express';

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
    console.log(req);
    const query = req.query;
    const number = parseInt(req.query.number);

    if ( ! Number.isInteger(number) ){
        res.status(400);
        res.send("<h2>Invalid Request</h2>");
        return;
    }
    
   // DNS Stuff
    
});

app.listen(PORT, HOST);
console.log(`User Server running on http://${HOST}:${PORT}`);