pragma solidity ^0.5.0;

import "./ERC721Full.sol";
import "./MessageOwner.sol";

contract Tokenizer is ERC721Full {
    string[] messages;
    mapping(string => address) messageOwners;
    constructor() ERC721Full("Token", "TOKEN") public {}
    function mint(string memory _message, string memory _regId) public {
        uint _id = messages.push(_message);
        if(messageOwners[_regId] == 0x0000000000000000000000000000000000000000) {
            MessageOwner owner = new MessageOwner(_regId);
            messageOwners[_regId] = address(owner);
        }
        _mint(messageOwners[_regId], _id);
    }

    function getMessage(uint _index) public view returns(string memory) {
        return messages[_index];
    }

    function getOwnerAddress(string memory _regId) public view returns(address) {
        return messageOwners[_regId];
    }
}