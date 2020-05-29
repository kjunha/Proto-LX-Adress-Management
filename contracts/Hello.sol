pragma solidity ^0.5.0;

contract Hello{
    string public name;
    constructor(string memory _name) public {
        name = _name;
    }
    function setName(string memory _name) public {
        name = _name;
    }
    function sayHello() public view returns(string memory) {
        return string(abi.encodePacked("Hello, ", name));
    }

}