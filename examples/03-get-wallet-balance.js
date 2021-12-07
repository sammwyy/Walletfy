const Walletfy = require("../");
const lib = new Walletfy();

lib.getBalance("eth", "0xf3db5fa2c66b7af3eb0c0b782510816cbe4813b8").then((balance) => {
    console.log("Wallet balance:");
    console.log(balance);
})