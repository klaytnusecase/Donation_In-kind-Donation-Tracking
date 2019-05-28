var Migrations = artifacts.require("./Migrations.sol");
var HappyAlliance = artifacts.require("./HappyAlliance.sol");
module.exports = function(deployer) {
	deployer.deploy(Migrations);
	deployer.deploy(HappyAlliance);
};