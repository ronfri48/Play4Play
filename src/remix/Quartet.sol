pragma solidity ^0.5.8;

contract Quartet {
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

    // Define card structure
    struct Card {
        bytes32 name; // card name
        CardFamilies family; // card family
    }

    address private _player;
}
