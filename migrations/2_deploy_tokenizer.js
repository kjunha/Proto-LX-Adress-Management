const tokenizer = artifacts.require('./Tokenizer');

module.exports = ((deployer) => {
    deployer.deploy(tokenizer);
});
