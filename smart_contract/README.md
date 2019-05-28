# Solidity code for SK & GX & Prisming

## Configuration

1. Install Truffle: sudo npm install -g truffle
2. Install Ganache (local ethereum network): https://truffleframework.com/ganache, 127.0.0.1:7545, network ID: 5777
3. npm install solc

## Testing 
3. In command line:
  - Type "truffle migrate" (always when the solidity code is updated)
  - Type "truffle console" to check the validity of the code

4. In truffle console, 
  - Type "HappyAlliance.deployed().then(function(instance) { app = instance })"
  - You can access the first box that we manually put by typing "app.boxes(0)". Its ID is "test".
  - The destination of the first box can be obtained through the function "getDestinationOfBox".
  - app.getDestinationOfBox("test") will be "prisming". 
  
  
## Working for
* Pass arrays to functions
* Record multiple stuff ids and quantities in a struct "Box"

## To initialize folder,
* In command line:
  - Type "truffle init"
  - Move HappyAlliance.sol to the folder "contracts"
* Modify the file "./migrations/1_initial_migration.js" as:
```
  var Migrations = artifacts.require("./Migrations.sol");
  var HappyAlliance = artifacts.require("./HappyAlliance.sol");
  module.exports = function(deployer) {
   deployer.deploy(Migrations);
   deployer.deploy(HappyAlliance);
  };
```
* Add the following chunks to the file "truffle_config.js"
```
networks: {
  ganache: {
        host: "127.0.0.1",
        port: 7545,
        network_id: 5777,
  }
}
solc: {
       version: "0.4.24",
}
```

