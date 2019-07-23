pragma solidity ^0.4.24;

import "./strings.sol";

contract Card {
    // Define all the optional card families
    string[] private _allCardFamilies = [
        "Banks",
        "BasketBallTeams",
        "Celebs",
        "Cities",
        "Food",
        "FootBallTeams",
        "Inventions",
        "Places",
        "Univrsities",
        "Words"
        ];
    
    string private _name; // card name
    string private _family; // card family

    modifier isValidFamily(string memory _familyToCheck) {
        bool _wasFound = false;
        for (uint index = 0; index < _allCardFamilies.length; index++) {
            string memory _currentFamily = _allCardFamilies[index];
            if (StringUtils.equal(_currentFamily, _familyToCheck)) {
                _wasFound = true;
                break;
            }
        }

        require(_wasFound, "Invalid Family");
        _;
    }

    constructor(string memory _cardName, string memory _cardFamily) isValidFamily(_cardFamily) public {
        _name = _cardName;
        _family = _cardFamily;
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