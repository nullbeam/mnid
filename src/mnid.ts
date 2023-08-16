import { sha3_256 } from 'js-sha3'
import { Buffer } from 'buffer'
import { BASE58, HEX } from './constants';

const base58 = require('base-x')(BASE58);
const hex = require('base-x')(HEX);

type Data = {
    network: string
    address: string
}

class MNID {
    constructor() {};

    private static checksum(payload: Array<Buffer>) {
        return Buffer.from(sha3_256(Buffer.concat(payload)), 'hex').subarray(0, 4);
    };

    public static encode(data: Data) {
        const payload = [Buffer.from('01', 'hex'), hex.decode(data.network.slice(2)), Buffer.from(data.address.slice(2), 'hex')]
        payload.push(MNID.checksum(payload))
        return base58.encode(Buffer.concat(payload))
    }

    public static decode(encodedData: string) {
        const data = Buffer.from(base58.decode(encodedData))
        const netLength = data.length - 24
        const version = data.subarray(0, 1)
        const network = data.subarray(1, netLength)
        const address = data.subarray(netLength, 20 + netLength)
        const check = data.subarray(netLength + 20)
        if (check.equals(MNID.checksum([version, network, address]))) {
            return {
                network: `0x${hex.encode(network)}`,
                address: `0x${address.toString('hex')}`
            }
        } else {
            throw new Error('Invalid address checksum')
        }
    }

    public static isMNID(encodedData: string) {
        try {
            const data = Buffer.from(base58.decode(encodedData))
            return data.length > 24 && data[0] === 1
        } catch (e) {
            return false
        }
    }
}

export default MNID;