pragma solidity ^0.5.0;

contract MessageOwner {
    string public name;
    string public residence;
    address public host;
    mapping(address => bool) accessability;
    constructor(string memory _name, string memory _residence) public {
        host = address(msg.sender);
        name = _name;
        residence = _residence;
    }
    function getInfo() public view returns(string memory _name, string memory _residence) {
        if(accessability[address(msg.sender)] || host == address(msg.sender)) {
            _name = name;
            _residence = residence;
        } else {
            _name = "Access not allowed.";
            _residence = "";
        }
    }
    //only Host
    function register(address _corpId) public {
        accessability[_corpId] = true;
    }
    function deregister(address _corpId) public {
        accessability[_corpId] = false;
    }

    function registerAsHost() public {
        host = msg.sender;
    }
}