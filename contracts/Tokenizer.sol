pragma solidity ^0.5.0;

import "./MessageOwner.sol";

contract Tokenizer {
    mapping(string => address) messageOwners;
    event RegisterNewUser(string name, string residence, address contractId);

    //assume all name is unique
    function signup(string memory _name, string memory _residence) public returns(address){
        if(messageOwners[_name] == 0x0000000000000000000000000000000000000000) {
            MessageOwner owner = new MessageOwner(_name, _residence);
            messageOwners[_name] = address(owner);
            owner.registerAsHost(msg.sender);
        } else {
            MessageOwner owner = MessageOwner(messageOwners[_name]);
            owner.updateAddress(_residence);
        }
        return messageOwners[_name];
    }

    function getOwnerAddress(string memory _regId) public view returns(address) {
        return messageOwners[_regId];
    }
}