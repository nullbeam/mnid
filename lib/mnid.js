"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_sha3_1 = require("js-sha3");
var buffer_1 = require("buffer");
var constants_1 = require("./constants");
var base58 = require('base-x')(constants_1.BASE58);
var hex = require('base-x')(constants_1.HEX);
var MNID = (function () {
    function MNID() {
    }
    ;
    MNID.checksum = function (payload) {
        return buffer_1.Buffer.from((0, js_sha3_1.sha3_256)(buffer_1.Buffer.concat(payload)), 'hex').subarray(0, 4);
    };
    ;
    MNID.encode = function (data) {
        var payload = [buffer_1.Buffer.from('01', 'hex'), hex.decode(data.network.slice(2)), buffer_1.Buffer.from(data.address.slice(2), 'hex')];
        payload.push(MNID.checksum(payload));
        return base58.encode(buffer_1.Buffer.concat(payload));
    };
    MNID.decode = function (encodedData) {
        var data = buffer_1.Buffer.from(base58.decode(encodedData));
        var netLength = data.length - 24;
        var version = data.subarray(0, 1);
        var network = data.subarray(1, netLength);
        var address = data.subarray(netLength, 20 + netLength);
        var check = data.subarray(netLength + 20);
        if (check.equals(MNID.checksum([version, network, address]))) {
            return {
                network: "0x".concat(hex.encode(network)),
                address: "0x".concat(address.toString('hex'))
            };
        }
        else {
            throw new Error('Invalid address checksum');
        }
    };
    MNID.isMNID = function (encodedData) {
        try {
            var data = buffer_1.Buffer.from(base58.decode(encodedData));
            return data.length > 24 && data[0] === 1;
        }
        catch (e) {
            return false;
        }
    };
    return MNID;
}());
exports.default = MNID;
//# sourceMappingURL=mnid.js.map