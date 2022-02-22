import * as fs from 'fs/promises';
import * as readline from 'readline/promises';

const isDnsRegistration = (msg) => {
  if (msg.indexOf("VALUE=") != -1 && msg.indexOf("TTL") != -1) {
    return true;
  }
  return false;
};

const dnsMessageToJson = (msg) => {
  let response = {};
  msg = msg.toString();

  // TYPE
  const typeRegex = /TYPE=A\n/;
  if (typeRegex.test(msg)) {
    response.type = "A";
  }

  // NAME
  const nameRegex = /NAME=(.*)\n/;
  let match = msg.match(nameRegex);
  if (match) {
    response.name = match[1];
  }

  // VALUE
  const valueRegex = /VALUE=(.*)\n/;
  match = msg.match(valueRegex);
  if (match) {
    response.value = match[1];
  }

  // TTL
  const ttlRegext = /TTL=(\d*)$/;
  match = msg.match(ttlRegext);
  if (match) {
    response.ttl = parseInt(match[1]);
  }

  // add msgType
  response.msgType = getMessageType(response);

  return response;
};

const getMessageType = (msgObj) => {
  const keys = Object.keys(msgObj);
  const queryKeys = ["type", "name"];
  const registrationKeys = ["type", "name", "value", "ttl"];

  if (keys.length == 2 &&
    keys.every((key) => { return queryKeys.includes(key) })) {
        return "QUERY";
  } else if (keys.length == 4 && keys.every((key) => { return registrationKeys.includes(key)})) {
      return "REGISTRATION";
  } else {
      return "UNKNOWN";
  }
};

const findRecordInFile = async (filePath, searchText) => {
    
    let file;
    let stream;

    try {
        // try opening file
        try {
            file = await fs.open(filePath)
            stream = file.createReadStream();
        }  catch (err){
            console.error(`Could not open file: ${filePath}: ${err}`);
            return;
        }
        const rl = await readline.createInterface({
            input: stream,
            output: null
        });
        
        for await (const line of rl) {
           if (line.indexOf(searchText) != -1){
                return new Promise( (resolve, reject) => {
                    resolve(line);
                });
           } else {
               console.debug(`${line} does not contain ${searchText}`);
           }
        }

    } catch (err){
        console.error(`Could not open file: ${filePath}: ${err}`);
        return;
    } finally {
        await stream?.close();
    }
}

export { isDnsRegistration, dnsMessageToJson, getMessageType, findRecordInFile };
