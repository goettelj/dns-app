import {isDnsRegistration, dnsMessageToJson, getMessageType} from './utils';

const QUERY = `TYPE=A\nNAME=fibonacci.com`;

const REGISTRATION = `TYPE=A\nNAME=fibonacci.com\nVALUE=127.0.0.1\nTTL=10`;

describe('isDnsRegistration', ()=>{
    
    it('returns true for registration request', () => {
        expect(isDnsRegistration(REGISTRATION)).toBe(true);
    });

    it('returns false for query request', () => {
        expect(isDnsRegistration(QUERY)).toBe(false);
    });

});

describe('dnsMessageToJson', () => {
    it('works for valid registration message', () => {
        
        const expected = {
            msgType: 'REGISTRATION',
            type: 'A',
            name: 'fibonacci.com',
            value: '127.0.0.1',
            ttl: 10
        };
        
        const result = dnsMessageToJson(REGISTRATION);

        expect(result).toEqual(expected);
    })
});

describe('getMessageType', () => {
    it('returns QUERY for query msg', () => {
        const input = {
            type: 'A',
            name: 'fibonacci.com'
        };

        const result = getMessageType(input);

        expect(result).toBe('QUERY');
    });

    it('returns REGISTRATION for registration msg', () => {
        const input = {
            type: 'A',
            name: 'fibonacci.com',
            value: '127.0.0.1',
            ttl: 10
        };

        const result = getMessageType(input);

        expect(result).toBe('REGISTRATION');
    });

    it('returns UNKNOWN when invalid object is send', () => {
        const input = {
            foo: "bar"
        };

        const result = getMessageType(input);

        expect(result).toBe("UNKNOWN");
    });


})