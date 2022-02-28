import { isDnsRegistration, dnsMessageToJson, getMessageType } from "./utils";

const QUERY = `TYPE=A\nNAME=fibonacci.com`;
const QUERY_W_COMMA = `TYPE=A,NAME=fibonacci.com`;

const REGISTRATION = `TYPE=A\nNAME=fibonacci.com\nVALUE=127.0.0.1\nTTL=10`;
const REGISTRATION_W_COMMAS = `TYPE=A,NAME=fibonacci.com,VALUE=127.0.0.1,TTL=10`;

describe("isDnsRegistration", () => {
  it("returns true for registration request", () => {
    expect(isDnsRegistration(REGISTRATION)).toBe(true);
  });

  it("returns false for query request", () => {
    expect(isDnsRegistration(QUERY)).toBe(false);
  });
});

describe("dnsMessageToJson", () => {
  const expected = {
    msgType: "REGISTRATION",
    type: "A",
    name: "fibonacci.com",
    value: "127.0.0.1",
    ttl: 10,
  };

  it("works for valid registration message with new lines", () => {
    const result = dnsMessageToJson(REGISTRATION);

    expect(result).toEqual(expected);
  });

  it("works for valid registration message with commas", () => {
    const result = dnsMessageToJson(REGISTRATION_W_COMMAS);

    expect(result).toEqual(expected);
  });

  const queryExpected = {
    msgType: "QUERY",
    type: "A",
    name: "fibonacci.com"
  };

  it("works for valid query message with new lines", () => {
    const result = dnsMessageToJson(QUERY);

    expect(result).toEqual(queryExpected);
  });

  it("works for valid query message with commas", () => {
    const result = dnsMessageToJson(QUERY_W_COMMA);

    expect(result).toEqual(queryExpected);
  })

});

describe("getMessageType", () => {
  it("returns QUERY for query msg", () => {
    const input = {
      type: "A",
      name: "fibonacci.com",
    };

    const result = getMessageType(input);

    expect(result).toBe("QUERY");
  });

  it("returns REGISTRATION for registration msg", () => {
    const input = {
      type: "A",
      name: "fibonacci.com",
      value: "127.0.0.1",
      ttl: 10,
    };

    const result = getMessageType(input);

    expect(result).toBe("REGISTRATION");
  });

  it("returns UNKNOWN when invalid object is send", () => {
    const input = {
      foo: "bar",
    };

    const result = getMessageType(input);

    expect(result).toBe("UNKNOWN");
  });
});
