const serviceHost = artifacts.require('./ServiceHost');

module.exports = ((deployer) => {
    deployer.deploy(serviceHost);
});
