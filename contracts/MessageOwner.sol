pragma solidity ^0.5.0;

contract MessageOwner {
    string public name;
    string public residence;
    mapping(address => bool) accessability;
    constructor(string memory _name, string memory _residence) public {
        name = _name;
        residence = _residence;
    }
    function getInfo() public view returns(string memory _name, string memory _residence) {
        _name = name;
        _residence = residence;
    }
    function register(address _corpId) public {
        accessability[_corpId] = true;
    }
    function deregister(address _corpId) public {
        accessability[_corpId] = false;
    }
}