const Walletfy = require("../");
const lib = new Walletfy();

lib.generateWallet("eth").then((wallet) => {
    console.log("Generated wallet:");
    console.log(wallet);
})