pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./Card.sol";
import "./string/strings.sol";

contract Quartet {
    using strings for *;

    // Define player structure
    struct Player {
        bytes32 name; // card name
        address playerAddress; // player address
        uint256 numberOfFours; // current number of points the player has reahced during the game
        uint256 numberOfJokers; // number of Joker crads the player has
        uint256 numberOfSwappers; // number of "Swap with other player" crads the player has
        uint256 numberOfWatchers; // number of "Watch other's cards" crads the player has
        Card[] cards; // player cards
    }

    mapping(address => Player) private _players;
    mapping (uint256 => address) private _playersIndex;
    address private _currentPlayer;
    uint256 private _numberOfPlayers;
    uint256 private _winBalance;
    uint256 private _ethLimit = 1000000 wei;
    uint256 private _jokerPrice = 2;
    uint256 private _watcherPrice = 3;
    uint256 private _swapperPrice = 4;
    Card[] private _moreCards;
    Card[] private _allCards;


    ///-----------event logging-------------///
    event PlayerDeposit(address _contract, address _player, uint256 _amount);
    event PlayerWithdrawal(address _contract, address _player, uint256 _amount);
    event CardMove(address _src, address _dst, bytes32 _cardName);
    event FourFound(address _player, string _cardFamily);
    event JokerUsed(address _player);
    event SwapperUsed(address _player, address _swappedPlayer);
    event WatcherUsed(address _player, address _watchedPlayer);

    ///--------Modifiers----------///
    //make sure address is Valid
    modifier isValidAddr() {
        require(msg.sender != address(0x0), "Invalid Address.");
        _;
    }

    //make sure address is Player
    modifier isPlayer(address _address) {
        require(_players[_address].name != 0, "Only Player can use this function.");
        _;
    }

    //make sure the game is not full
    modifier isThereFreePlace() {
        require(_numberOfPlayers <= 4, "Only 4 participants can participate in the game.");
        _;
    }

    //make sure the game has finished
    modifier hasGameFinished() {
        require(_moreCards.length == 0, "Game is finished only after there are no remaining cards.");
        _;
    }

    //make sure the requested player is the current player
    modifier isCurrentPlayer(address _player) {
        require(msg.sender == _player, "Only player can get his cards.");
        _;
    }

    ///******constructor********///
    constructor() public {
        _currentPlayer = address(0x0);
        _winBalance = 0;
        _numberOfPlayers = 0;

        _allCards.push(new Card("Diskont", Card.CardFamilies.Banks));
        _allCards.push(new Card("Hapoalim", Card.CardFamilies.Banks));
        _allCards.push(new Card("OtzarHahayal", Card.CardFamilies.Banks));
        _allCards.push(new Card("Pepper", Card.CardFamilies.Banks));
        _allCards.push(new Card("HapoelBeerSheva", Card.CardFamilies.BasketBallTeams));
        _allCards.push(new Card("HapoelJerusalem", Card.CardFamilies.BasketBallTeams));
        _allCards.push(new Card("MacabiTelAviv", Card.CardFamilies.BasketBallTeams));
        _allCards.push(new Card("MacabiRishonLetzion", Card.CardFamilies.BasketBallTeams));
        _allCards.push(new Card("BarRefaeli", Card.CardFamilies.Celebs));
        _allCards.push(new Card("GalGadot", Card.CardFamilies.Celebs));
        _allCards.push(new Card("Netta", Card.CardFamilies.Celebs));
        _allCards.push(new Card("OmriCasspi", Card.CardFamilies.Celebs));
        _allCards.push(new Card("Eilat", Card.CardFamilies.Cities));
        _allCards.push(new Card("Haifa", Card.CardFamilies.Cities));
        _allCards.push(new Card("Jerusalem", Card.CardFamilies.Cities));
        _allCards.push(new Card("TelAviv", Card.CardFamilies.Cities));
        _allCards.push(new Card("Bamba", Card.CardFamilies.Food));
        _allCards.push(new Card("Falafel", Card.CardFamilies.Food));
        _allCards.push(new Card("Humus", Card.CardFamilies.Food));
        _allCards.push(new Card("Shakshuka", Card.CardFamilies.Food));
        _allCards.push(new Card("BeitarJerusalem", Card.CardFamilies.FootBallTeams));
        _allCards.push(new Card("HapoelBeerSheva", Card.CardFamilies.FootBallTeams));
        _allCards.push(new Card("MacabiHaifa", Card.CardFamilies.FootBallTeams));
        _allCards.push(new Card("MacabiTelAviv", Card.CardFamilies.FootBallTeams));
        _allCards.push(new Card("IronDome", Card.CardFamilies.Inventions));
        _allCards.push(new Card("Mobileye", Card.CardFamilies.Inventions));
        _allCards.push(new Card("Usb", Card.CardFamilies.Inventions));
        _allCards.push(new Card("Waze", Card.CardFamilies.Inventions));
        _allCards.push(new Card("Masada", Card.CardFamilies.Places));
        _allCards.push(new Card("RamonCenter", Card.CardFamilies.Places));
        _allCards.push(new Card("WesternWall", Card.CardFamilies.Places));
        _allCards.push(new Card("HebrewUniversity", Card.CardFamilies.Univrsities));
        _allCards.push(new Card("IDC", Card.CardFamilies.Univrsities));
        _allCards.push(new Card("Technion", Card.CardFamilies.Univrsities));
        _allCards.push(new Card("TelAvivUniversity", Card.CardFamilies.Univrsities));
        _allCards.push(new Card("Toda", Card.CardFamilies.Words));
        _allCards.push(new Card("Sababa", Card.CardFamilies.Words));
        _allCards.push(new Card("Kapara", Card.CardFamilies.Words));
        _allCards.push(new Card("Basa", Card.CardFamilies.Words));

        _moreCards = _allCards;
    }


    ///*********fallback - Unused***********///
    function () external isValidAddr payable {
        //Players must use PayContract function to pay
        revert("Please use PayContract Function to pay.");
    }


    ///************regsiter to game*************///
    function registerIntoGame(bytes32 _playerName) public isValidAddr isThereFreePlace payable returns (string memory) {
        //make sure contract cannot accept more than ether limit
        require((_winBalance + msg.value) <= _ethLimit, "Too much Ether!");

        _winBalance += msg.value;

        // Add player
        Card[] memory _cards;
        _players[msg.sender] = Player(_playerName, msg.sender, 0, 0, 0, 0, _cards);
        _playersIndex[_numberOfPlayers] = msg.sender;
        _numberOfPlayers++;

        emit PlayerDeposit(address(this), msg.sender, msg.value);

        evenGame();

        return "Registered Successfuly.";
    }

    function exitGame() public isValidAddr {
        // Remove player
        delete _players[msg.sender];
        _numberOfPlayers--;
    }

    // Move the last element to the deleted spot.
    // Delete the last element, then correct the length.
    function _popCard(uint index) internal {
        require(index < _moreCards.length, "Index is out of array");
        _moreCards[index] = _moreCards[_moreCards.length-1];
        delete _moreCards[_moreCards.length-1];
        _moreCards.length--;
    }

    function getRandomNumber(uint _max) internal view returns (uint) {
        uint _randNum = (uint(keccak256(abi.encodePacked(blockhash(block.number - 1), now)))%13 + 1) % _max;
        return _randNum;
    }

    function popCardFromCenter() internal returns (Card) {
        uint _randIndex = getRandomNumber(_moreCards.length);
        Card _card = _moreCards[_randIndex];
        _popCard(_randIndex);

        return _card;
    }

    function addCardToPlayer(address _player, Card _card) internal isPlayer(_player) {
        _players[_player].cards.push(_card);
    }

    function doesPlayerHaveCard(address _player, bytes32 _cardName) internal view isPlayer(_player) returns (bool) {
        Card[] memory _playerCards = _players[_player].cards;
        for(uint i = 0; i<_playerCards.length; i++){
            if (_cardName == _playerCards[i].name()) {
                return true;
            }
        }

        return false;
    }

    function getCardFromPlayer(address _player, bytes32 _cardName) internal isPlayer(_player) returns (Card) {
        require(doesPlayerHaveCard(_player, _cardName), "Src Player does not have the card");

        Card[] memory _playerCards = _players[_player].cards;
        Card _cardToMove;
        for(uint i = 0; i<_playerCards.length; i++){
            if (_cardName == _playerCards[i].name()) {
                _cardToMove = _playerCards[i];

                // Update source cards
                _playerCards[i] = _playerCards[_playerCards.length-1];
                delete _playerCards[_playerCards.length-1];
                _players[_player].cards = _playerCards;

                return _cardToMove;
            }
        }
        revert("Card Not Found");
    }

    function moveCard(address _src, bytes32 _cardName) public {
        Card _card = getCardFromPlayer(_src, _cardName);
        addCardToPlayer(msg.sender, _card);

        emit CardMove(_src, msg.sender, _cardName);
    }

    function evenGame() public {
        for(uint i = 0; i<_numberOfPlayers; i++){
            while (_players[_playersIndex[i]].cards.length < 4) {
                addCardToPlayer(_playersIndex[i], popCardFromCenter());
            }
        }
    }

    function findFours(address _player, uint _numberOfJokersToUse) public returns(Card.CardFamilies[] memory) {
        require(_numberOfJokersToUse <= _players[_player].numberOfJokers, "Can not use more jokers than current num of jokers.");

        Card[] memory _playerCards = _players[_player].cards;
        Card.CardFamilies[] memory _foundFours;

        // Find fours
        for(uint i = 0; i < _playerCards.length; i++) {
            uint256 _familyCounter = 0;

            for(uint j = i; j < _playerCards.length; j++) {
                if(_playerCards[i].family() == _playerCards[j].family()) {
                    _familyCounter++;
                }
            }

            if (_familyCounter == 4 || (_numberOfJokersToUse > 0 && _familyCounter == 3)) {
                if (_familyCounter == 3) {
                    _players[_player].numberOfJokers--;
                    emit JokerUsed(_player);
                }

                Card.CardFamilies _cardFamily = _playerCards[i].family();
                string memory _cardFamilyStr = "";
                _cardFamilyStr += string.toString(_cardFamily);
                emit FourFound(_player, _cardFamilyStr);
                _foundFours.push(_cardFamily);

                _players[_player].numberOfFours++;
            }
        }

        Card[] memory _newPlayerCards;
        // Remove cards already combined to four
        for(uint i = 0; i < _players[_player].cards.length; i++) {
            bool _shouldSave = true;
            for(uint j = 0; j < _foundFours.length; j++) {
                if(_players[_player].cards[i].family() == _foundFours[j]) {
                    _shouldSave = false;
                    break;
                }
            }

            if (_shouldSave) {
                _newPlayerCards.push(_players[_player].cards[i]);
            }
        }

        _players[_player].cards = _newPlayerCards;
        _players[_player].cards.length = _newPlayerCards.length;

        return _foundFours;
    }

    function teardownGame() public hasGameFinished {
        address _winningPlayer = address(0x0);
        uint maxFours = 0;

        for(uint i = 0; i < _numberOfPlayers; i++){
            if (_players[_playersIndex[i]].numberOfFours > maxFours) {
                _winningPlayer = _playersIndex[i];
                maxFours = _players[_playersIndex[i]].numberOfFours;
            }
        }

        _winningPlayer.transfer(_winBalance);
        emit PlayerWithdrawal(address(this), _winningPlayer, _winBalance);
    }

    function getPlayerCards(address _player) public isCurrentPlayer(_player) returns (Card[] memory) {
        return _players[_player].cards;
    }

    function getPlayerCardsHashes(address _player) public returns (bytes32[] memory) {
        Card[] memory _playerCards = _players[_player].cards;
        bytes32[] memory _hashes;

        for(uint index = 0; index < _playerCards.length; index++) {
            _hashes.push(_playerCards[index].getHash());
        }

        return _hashes;
    }

    function getPrettyPlayerCards(address _player) public isCurrentPlayer(_player) returns (string[] memory) {
        Card[] memory _playerCards = _players[_player].cards;
        string[] memory _cards;

        for(uint index = 0; index < _playerCards.length; index++) {
            Card _card = _playerCards[index];
            string memory _cardStr = string(_card.name());
            _cardStr += string(", ");
            _cardStr += string.toString(_card.family());
            _cards.push(_cardStr);
        }

        return _cards;
    }

    function swapCards(address _playerToSwapWith) public {
        require(_players[msg.sender].numberOfSwappers > 0, "Can not use swapper if have no swappers.");

        Card[] memory _senderCards = _players[msg.sender].cards;
        Card[] memory _swappedCards = _players[_playerToSwapWith].cards;

        _players[msg.sender].numberOfSwappers--;
        _players[msg.sender].cards = _swappedCards;
        _players[_playerToSwapWith].cards = _senderCards;
        emit SwapperUsed(msg.sender, _playerToSwapWith);
    }

    function watchCards(address _playerToWatch) public returns(Card[] memory) {
        require(_players[msg.sender].numberOfWatchers > 0, "Can not use watcher if have no watchers.");

        emit WatcherUsed(msg.sender, _playerToWatch);
        _players[msg.sender].numberOfSwappers--;
        return _players[_playerToWatch].cards;
    }

    function buyJoker() public payable {
        require(msg.value == _jokerPrice, "Should pay for joker");
        _players[msg.sender].numberOfJokers++;
    }

    function buyWatcher() public payable {
        require(msg.value == _watcherPrice, "Should pay for watcher");
        _players[msg.sender].numberOfWatchers++;
    }

    function buySwapper() public payable {
        require(msg.value == _swapperPrice, "Should pay for swapper");
        _players[msg.sender].numberOfSwappers++;
    }

    function getHashForCard(bytes32 _name) public returns (Card){
        for(uint index = 0; index < _allCards.length; index++) {
            if(_allCards[index].name() == _name) {
                return _allCards[index].getHash();
            }
        }
        revert("Can not find requested card");
    }
}
