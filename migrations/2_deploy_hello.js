const hello = artifacts.require('./Hello');

const helloSettings = {
    name: "steve"
}

module.exports = ((deployer) => {
    deployer.deploy(hello, helloSettings.name);
});
