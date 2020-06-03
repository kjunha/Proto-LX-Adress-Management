pragma solidity ^0.5.0;

import "./Client.sol";

contract ServiceHost {
    mapping(string => address) clients;
    event RegisterNewClient(string name, string residence, address contractId);

    //assume all name is unique
    function signup(string memory _name, string memory _residence) public returns(address){
        if(clients[_name] == 0x0000000000000000000000000000000000000000) {
            Client client = new Client(_name, _residence);
            clients[_name] = address(client);
            client.registerAsHost(msg.sender);
            emit RegisterNewClient(_name, _residence, address(client));
        } else {
            Client client = Client(clients[_name]);
            client.updateResidence(_residence);
        }
        return clients[_name];
    }

    function getClientAddress(string memory _regId) public view returns(address) {
        return clients[_regId];
    }
}