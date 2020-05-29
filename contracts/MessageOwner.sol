pragma solidity ^0.5.0;

contract MessageOwner {
    string public regId;
    constructor(string memory _regId) public {
        regId = _regId;
    }
    function getRegId() public view returns(string memory) {
        return regId;
    }
}