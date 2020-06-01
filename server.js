require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Web3 = require("web3");
const app = express();
const localtest = "HTTP://127.0.0.1:7545";
const web3 = new Web3(new Web3.providers.HttpProvider(localtest));
let accounts;


//Body Parser and CORS configuration
app.use(cors());
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.route('/signup').get(async (req,res) => {

})

app.route('/register').get(async (req,res) => {

})

app.route('/deregister').get(async (req,res) => {

})



//Router & Server Call
var server = app.listen(3000, async () => {
    accounts = await web3.eth.getAccounts();
    console.log("Server running on port 3000");
});