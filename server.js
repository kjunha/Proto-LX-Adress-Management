require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Web3 = require("web3");
const app = express();
const localtest = "HTTP://127.0.0.1:7545";
const web3 = new Web3(new Web3.providers.HttpProvider(localtest));
const Tokenizer = require("./build/contracts/Tokenizer.json");
const MessageOwner = require("./build/contracts/MessageOwner.json");

//Blockchain Field
let contract;
let accounts;



//Body Parser and CORS configuration
app.use(cors());
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());


const loadBlockchainData = async () => {
    accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const networkData = Tokenizer.networks[networkId]
    if(networkData) {
        const abi = Tokenizer.abi;
        contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
        console.log(contract.options.address);
    } else {
        console.log("smart contract is not deployed on this network");
    }
}


app.route('/').get((req,res) => {
    console.log(req.body);
    res.send(`name: ${req.body.name} ,address: ${req.body.residence}`);
})

app.route('/signup').get(async (req,res) => {
    contract.methods.signup(req.body.name, req.body.residence).send({from: accounts[0]}).then((receipt) => {console.log(receipt)});
    const userContractId = await contract.methods.getOwnerAddress(req.body.name).call({from: accounts[0]});
    console.log(userContractId);
    const userContract = await new web3.eth.Contract(MessageOwner.abi, userContractId);
    console.log("user contract load");
    userContract.methods.registerAsHost().send({from: accounts[0]});
    console.log("send request")
})

app.route('/register').get(async (req,res) => {

})

app.route('/deregister').get(async (req,res) => {

})



//Router & Server Call
var server = app.listen(3000, () => {
    loadBlockchainData();
    console.log("Server running on port 3000");
});