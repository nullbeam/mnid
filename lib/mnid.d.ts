type Data = {
    network: string;
    address: string;
};
declare class MNID {
    constructor();
    private static checksum;
    static encode(data: Data): any;
    static decode(encodedData: string): {
        network: string;
        address: string;
    };
    static isMNID(encodedData: string): boolean;
}
export default MNID;
