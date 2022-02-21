import dgram from 'dgram';

const server = dgram.createSocket('udp4');

// constants
const PORT = 53533;

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });
  
  server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });
  
  server.on('listening', () => {
    const address = server.address();
    console.log(`Authoritative Server listening ${address.address}:${address.port}`);
  });
  
  server.bind(PORT);