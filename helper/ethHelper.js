const web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const web3js = new web3(
    new web3.providers.HttpProvider(
      "https://ropsten.infura.io/v3/9e6d530e9835469c845878123cbe3dd0"
    )
);

const ETHTransfer =  async (receiver_address, amount, sender_address, sender_private_key) => {
    if(sender_private_key.length > 64){
        let num = sender_private_key.length - 64;
        sender_private_key = sender_private_key.slice(num);
    }
    const privateKey = Buffer.from(sender_private_key, 'hex');
    let estimates_gas = await web3js.eth.estimateGas({
        from: sender_address,
        to: receiver_address,
        amount: web3js.utils.toWei(amount, "ether"),
    });
    let gasLimit = web3js.utils.toHex(estimates_gas * 2);
    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
    let v = await web3js.eth.getTransactionCount(sender_address)
    let rawTransaction = {
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": receiver_address,
        "value": web3js.utils.toHex(web3js.utils.toWei(amount, "ether")),
        "nonce": web3js.utils.toHex(v)
    }
    let transaction = new Tx(rawTransaction, {chain:'ropsten'});
    transaction.sign(privateKey);
    let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
    return hash;
}

// const ETHCoinTransfer =  async (receiver_address, amount, sender_address, sender_private_key) => {
//     if(sender_private_key.length > 64){
//         let num = sender_private_key.length - 64;
//         sender_private_key = sender_private_key.slice(num);
//     }
//     const privateKey = Buffer.from(sender_private_key, 'hex');
//     let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
//     let estimates_gas = await web3js.eth.estimateGas({
//         from: sender_address,
//         to: receiver_address,
//         amount: web3js.utils.toWei(amount, "ether"),
//     });
//     let gasLimit = web3js.utils.toHex(estimates_gas * 2);
//     let gasPrice_bal = await web3js.eth.getGasPrice();
//     let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
//     let count = await web3js.eth.getTransactionCount(sender_address);
//     let sendAmount = amount * Math.pow(10, 10);
//     sendAmount = sendAmount.toString();
//     let rawTransaction = {
//         "from": sender_address,
//         "gasPrice": gasPrice,
//         "gasLimit": gasLimit,
//         "to": coinAddress,
//         "data": tokenContract.methods.transfer(receiver_address, sendAmount).encodeABI(),
//         "nonce": web3js.utils.toHex(count)
//     };
//     let transaction = new Tx(rawTransaction,{ chain: 'ropsten' });
//     transaction.sign(privateKey);
//     let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
//     return hash;
// }

const hashStatusETH = async (hash) => {
    let status = await web3js.eth.getTransactionReceipt(hash);
    if(status){
        return status.blockNumber;
    }
}

const balanceMainETH = async (account) => {
    let balance = await web3js.eth.getBalance(account);
    if(balance){
        balance = balance / Math.pow(10,18);
        return balance;
    }
};

// const coinBalanceETH = async (account) => {
//     let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
//     let balance;
//     try {
//         balance = await tokenContract.methods.balanceOf(account).call();
//         balance = parseFloat(balance) / Math.pow(10,18);
//     } catch (error) {
//         balance = 0;
//     }
//     return balance;
// };

module.exports = {
    ETHTransfer,
    // ETHCoinTransfer,
    hashStatusETH,
    balanceMainETH,
    // coinBalanceETH
}