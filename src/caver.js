/**
 * caver-js library make a connection with klaytn node.
 * You could connect to specific klaytn node by changing 'rpcURL' value.
 * If you are running a klaytn full node, set rpcURL to your node's URL.
 * ex) rpcURL: 'http://localhost:8551'
 * default rpcURL is 'https://api.baobab.klaytn.net:8651/'.
 */
import Caver from 'caver-js'

export const caver = new Caver('http://127.0.0.1:8551');
export const centerAddress = "0x3f3f1b10573e4168958d9176e05b74be17134c80";
export const centerPrivateKey = "0xbac724b0eb0b49ec3cac5c8ac22da15e8bbc4f539dbe91ec12d476c8ff1ea1e4";
export const contractAddress = "0xf8660faadcc69d18731de9da319d6033c3d3d7eb";

export default caver
