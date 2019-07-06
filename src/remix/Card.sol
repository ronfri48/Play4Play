pragma solidity ^0.5.0;

contract Card {
    // Define all needed enums
    enum CardFamilies {
        Banks,
        BasketBallTeams,
        Celebs,
        Cities,
        Food,
        FootBallTeams,
        Inventions,
        Places,
        Univrsities,
        Words
        }

    bytes32 private _name; // card name
    CardFamilies private _family; // card family

    constructor(bytes32 _cardName, CardFamilies _cardFamily) public {
        _name = _cardName;
        _family = _cardFamily;
    }

    function name() public view returns(bytes32) {
        return _name;
    }

    function family() public view returns(CardFamilies) {
        return _family;
    }

    function getHash() public view returns(bytes32) {
        return keccak256(abi.encodePacked(_name, msg.sender));
    }
}