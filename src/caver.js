/**
 * caver-js library make a connection with klaytn node.
 * You could connect to specific klaytn node by changing 'rpcURL' value.
 * If you are running a klaytn full node, set rpcURL to your node's URL.
 * ex) rpcURL: 'http://localhost:8551'
 * default rpcURL is 'https://api.baobab.klaytn.net:8651/'.
 */
import Caver from 'caver-js'

export const caver = new Caver('http://127.0.0.1:8551');
export const centerAddress = "0xa56a3611381c7749a9bd9e4e6edfd2d7c8a8fc52";
export const centerPrivateKey = "0xd447648abc237a38eda59a112b8d1700a93664ac94c8dc23ed6ca02c91bd8055";
export const contractAddress = "0x457c7efcbe9399a7dc59a165c87c6bda2a432c93";
export const password = "prisming1!";

export default caver
