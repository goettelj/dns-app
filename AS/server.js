import dgram from "dgram";
import * as fs from "fs/promises";
import { dnsMessageToJson, findRecordInFile } from "./utils.js";

const server = dgram.createSocket("udp4");

// constants
const PORT = 53533;

server.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

/**
 * main handle section
 */
server.on("message", async (msg, rinfo) => {
  logMessage(msg, rinfo);

  const msgObj = dnsMessageToJson(msg);

  switch (msgObj.msgType) {
    case "REGISTRATION":
      saveRegistration(msg);
      server.send("Successfully saved registration.", rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(`Error sending DNS query response! ${err}`);
        }
      });
      break;
    case "QUERY":
      const searchString = `NAME=${msgObj.name}`;
      let record = await findRecordInFile("data.txt", searchString);

      record = record || 'NOT_FOUND';
      console.log(`Result of DNS query: ${record}`); 
      server.send(record, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(`Error sending DNS query response! ${err}`);
        }
      });
      break;
    default:
      console.error("Invalid message received:");
      logMessage(msg, rinfo);
  }
});

server.on("listening", () => {
  const address = server.address();
  console.log(
    `Authoritative Server listening ${address.address}:${address.port}`
  );
});

server.bind(PORT);

/**
 * saveRegistration - Write DNS registration as a single line to data.txt
 * @param {*} msg - Registration text separated by newlines
 */
const saveRegistration = async (msg) => {
  const singleLineMsg = msg.toString().replaceAll(/\n/g, ",");

  try {
    const file = await fs.open("data.txt", "a");

    await file.write(singleLineMsg);
    await file.write("\n");

    await file.close();
  } catch (err) {
    console.error(`Problem writing DNS entry to datafile: ${err}`);
  }
};

function logMessage(msg, rinfo) {
  console.debug("================================");
  console.debug(new Date());
  console.debug("================================");
  console.debug(`server got:\n${msg}\nfrom ${rinfo.address}:${rinfo.port}`);
}
