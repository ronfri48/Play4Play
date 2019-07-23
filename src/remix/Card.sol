pragma solidity ^0.4.24;

import "./strings.sol";

contract Card {
    // Define all the optional card families
    string[] private _allCardFamilies;
    
    string private _name; // card name
    string private _family; // card family

    function isValidFamily(string memory _familyToCheck) public view returns(bool) {
        for (uint index = 0; index < _allCardFamilies.length; index++) {
            string memory _currentFamily = _allCardFamilies[index];
            if (StringUtils.equal(_currentFamily, _familyToCheck)) {
                return true;
            }
        }

        return false;
    }

    constructor(string memory _cardName, string memory _cardFamily) public payable {
        _name = _cardName;
        _family = _cardFamily;
        
        _allCardFamilies.push("Banks");
        _allCardFamilies.push("BasketBallTeams");
        _allCardFamilies.push("Celebs");
        _allCardFamilies.push("Cities");
        _allCardFamilies.push("Food");
        _allCardFamilies.push("FootBallTeams");
        _allCardFamilies.push("Inventions");
        _allCardFamilies.push("Places");
        _allCardFamilies.push("Univrsities");
        _allCardFamilies.push("Words");
        
        require(isValidFamily(_family), "Family should be valid");
    }
    
    function () external payable {
        revert("Please use PayContract Function to pay.");
    }

    function name() public view returns(string memory) {
        return _name;
    }

    function family() public view returns(string memory) {
        return _family;
    }

    function getHash() public view returns(bytes32) {
        return keccak256(abi.encodePacked(_name, msg.sender));
    }
}