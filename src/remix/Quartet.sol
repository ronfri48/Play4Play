pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

// import "./Card.sol";
import "./strings.sol";
import "./QuartetCoin.sol";

contract Quartet {
    using strings for *;
    
    struct Card
    {
        string name;
        string family;
    }
    
    function getHash(Card _card) public view returns(bytes32) {
        return keccak256(abi.encodePacked(_card.name, msg.sender));
    }

    // Define player structure
    struct Player {
        string name; // card name
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
    uint256 private _ethLimit = 1000000000000 wei;
    uint256 private _jokerPrice = 2;
    uint256 private _watcherPrice = 3;
    uint256 private _swapperPrice = 4;
    Card[] private _moreCards;
    Card[] private _allCards;
    bool private _isGameRunning = false;


    ///-----------event logging-------------///
    event PlayerDeposit(address _contract, address _player, uint256 _amount);
    event PlayerWithdrawal(address _contract, address _player, uint256 _amount);
    event CardMove(address _src, address _dst, string _cardName);
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
        require(_players[_address].cards.length >= 0, "Only Player can use this function.");
        _;
    }

    //make sure the game is not full
    modifier isThereFreePlace() {
        require(_numberOfPlayers <= 4, "Only 4 participants can participate in the game.");
        _;
    }

    //make sure there are no players
    modifier areThereNoPlayers() {
        require(_numberOfPlayers == 0, "Game can be closed only after there are no players.");
        _;
    }

    //make sure the game has finished
    modifier hasGameFinished() {
        require(_moreCards.length == 0, "Game is finished only after there are no remaining cards.");
        _;
    }

    //make sure the requested player is the current player
    modifier isCurrentPlayer(address _player) {
        require(_currentPlayer == _player, "Only player can get his cards.");
        _;
    }

    ///******constructor********///
    constructor() payable public {
        _currentPlayer = address(0x0);
        _winBalance = 0;
        _numberOfPlayers = 0;
        
        _allCards.push(Card("Diskont", "Banks"));
        _allCards.push(Card("Hapoalim", "Banks"));
        _allCards.push(Card("OtzarHahayal", "Banks"));
        _allCards.push(Card("Pepper", "Banks"));
        _allCards.push(Card("HapoelBeerSheva", "BasketBallTeams"));
        _allCards.push(Card("HapoelJerusalem", "BasketBallTeams"));
        _allCards.push(Card("MacabiTelAviv", "BasketBallTeams"));
        _allCards.push(Card("MacabiRishonLetzion", "BasketBallTeams"));
        _allCards.push(Card("BarRefaeli", "Celebs"));
        _allCards.push(Card("GalGadot", "Celebs"));
        _allCards.push(Card("Netta", "Celebs"));
        _allCards.push(Card("OmriCasspi", "Celebs"));
        _allCards.push(Card("Eilat", "Cities"));
        _allCards.push(Card("Haifa", "Cities"));
        _allCards.push(Card("Jerusalem", "Cities"));
        _allCards.push(Card("TelAviv", "Cities"));
        /*
        _allCards.push(Card("Bamba", "Food"));
        _allCards.push(Card("Falafel", "Food"));
        _allCards.push(Card("Humus", "Food"));
        _allCards.push(Card("Shakshuka", "Food"));
        _allCards.push(Card("BeitarJerusalem", "FootBallTeams"));
        _allCards.push(Card("HapoelBeerSheva", "FootBallTeams"));
        _allCards.push(Card("MacabiHaifa", "FootBallTeams"));
        _allCards.push(Card("MacabiTelAviv", "FootBallTeams"));
        _allCards.push(Card("IronDome", "Inventions"));
        _allCards.push(Card("Mobileye", "Inventions"));
        _allCards.push(Card("Usb", "Inventions"));
        _allCards.push(Card("Waze", "Inventions"));
        _allCards.push(Card("Masada", "Places"));
        _allCards.push(Card("RamonCenter", "Places"));
        _allCards.push(Card("WesternWall", "Places"));
        _allCards.push(Card("HebrewUniversity", "Places"));
        _allCards.push(Card("IDC", "Univrsities"));
        _allCards.push(Card("Technion", "Univrsities"));
        _allCards.push(Card("TelAvivUniversity", "Univrsities"));
        _allCards.push(Card("Toda", "Words"));
        _allCards.push(Card("Sababa", "Words"));
        _allCards.push(Card("Kapara", "Words"));
        _allCards.push(Card("Basa", "Words"));
        */
        
        for(uint i = 0; i < _allCards.length; i++) {
            _moreCards.push(_allCards[i]);
        }

        _isGameRunning = false;
    }


    ///*********fallback - Unused***********///
    function () external isValidAddr payable {
        //Players must use PayContract function to pay
        revert("Please use PayContract Function to pay.");
    }

    ///************regsiter to game*************///
    function registerIntoGame(string memory _playerName) public isValidAddr isThereFreePlace payable returns (string memory) {
        //make sure contract cannot accept more than ether limit
        require((_winBalance + msg.value) <= _ethLimit, "Too much Ether!");

        // For every player - add 1 to the winning prize
        _winBalance += 1;
        
        uint256 numberOfFours; // current number of points the player has reahced during the game
        uint256 numberOfJokers; // number of Joker crads the player has
        uint256 numberOfSwappers; // number of "Swap with other player" crads the player has
        uint256 numberOfWatchers; // number of "Watch other's cards" crads the player has
        Card[] cards; // player cards

        // Create player
        Player _player;
        _player.name = _playerName;
        _player.playerAddress = msg.sender;
        _player.numberOfFours = 0;
        _player.numberOfJokers = 0;
        _player.numberOfSwappers = 0;
        _player.numberOfWatchers = 0;
        
        // Add player
        _players[msg.sender] = _player;
        _playersIndex[_numberOfPlayers] = msg.sender;
        _numberOfPlayers++;

        emit PlayerDeposit(address(this), msg.sender, msg.value);

        evenGame();

        return "Registered Successfuly.";
        
        if(_numberOfPlayers == 4) {
            _isGameRunning = true;
        }
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

    function doesPlayerHaveCard(address _player, string memory _cardName) internal view isPlayer(_player) returns (bool) {
        for(uint i = 0; i < _players[_player].cards.length; i++){
            if (StringUtils.equal(_cardName, _players[_player].cards[i].name)) {
                return true;
            }
        }

        return false;
    }

    function doesPlayerHasCardFromFamily(address _player, string memory _cardName) internal view isPlayer(_player) returns (bool) {
        string memory _cardFamily;
        Card[] _playerCards;
        
        for(uint tempIndex = 0; tempIndex < _players[_player].cards.length; tempIndex++) {
            _playerCards.push(_players[_player].cards[tempIndex]);
        }

        for(uint i = 0; i<_allCards.length; i++) {
            if (StringUtils.equal(_cardName, _allCards[i].name)) {
                _cardFamily = _allCards[i].family;
            }
        }

        for(uint j = 0; j < _playerCards.length; j++) {
            if (StringUtils.equal(_cardFamily, _playerCards[j].family)) {
                return true;
            }
        }

        return false;
    }

    function getCardFromPlayer(address _player, string memory _cardName) internal isPlayer(_player) returns (Card) {
        require(doesPlayerHasCardFromFamily(msg.sender, _cardName), "You can not ask about a family you don't have");
        require(doesPlayerHaveCard(_player, _cardName), "Src Player does not have the card");
        
        Card[] _playerCards;
        
        for(uint tempIndex = 0; tempIndex < _players[_player].cards.length; tempIndex++) {
            _playerCards.push(_players[_player].cards[tempIndex]);
        }
        
        //Card _cardToMove;
        for(uint i = 0; i<_playerCards.length; i++){
            if (StringUtils.equal(_cardName, _playerCards[i].name)) {
               Card memory _cardToMove = _playerCards[i];

                // Update source cards
                _playerCards[i] = _playerCards[_playerCards.length-1];
                delete _playerCards[_playerCards.length-1];
                
                for(uint j = 0; j < _playerCards.length; j++) {
                    _players[_player].cards.push(_playerCards[j]);
                }
                
                return _cardToMove;
            }
        }
        revert("Card Not Found");
    }

    function moveCard(address _src, string memory _cardName) public {
        Card memory _card = getCardFromPlayer(_src, _cardName);
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
    
    function _findFours(address _player, Card[] _playerCards, uint _numberOfJokersToUse) internal returns(string[] memory) {
        string[] storage _foundFours;

        // Find fours
        for(uint i = 0; i < _playerCards.length; i++) {
            uint256 _familyCounter = 0;

            for(uint j = i; j < _playerCards.length; j++) {
                if(StringUtils.equal(_playerCards[i].family, _playerCards[j].family)) {
                    _familyCounter++;
                }
            }

            if (_familyCounter == 4 || (_numberOfJokersToUse > 0 && _familyCounter == 3)) {
                if (_familyCounter == 3) {
                    _players[_player].numberOfJokers--;
                    emit JokerUsed(_player);
                }

                emit FourFound(_player, _playerCards[i].family);
                _foundFours.push(_playerCards[i].family);

                _players[_player].numberOfFours++;
            }
        }
        
        return _foundFours;
    }
    
    function _removeFours(address _player, string[] memory _foundFours) internal {
        Card[] _newPlayerCards;
        // Remove cards already combined to four
        for(uint k = 0; k < _players[_player].cards.length; k++) {
            bool _shouldSave = true;
            for(uint l = 0; l < _foundFours.length; l++) {
                if(StringUtils.equal(_players[_player].cards[k].family, _foundFours[l])) {
                    _shouldSave = false;
                    break;
                }
            }

            if (_shouldSave) {
                _newPlayerCards.push(_players[_player].cards[k]);
            }
        }
        
        for(uint i = 0; i < _newPlayerCards.length; i++) {
            _players[_player].cards.push(_newPlayerCards[i]);
        }

        _players[_player].cards.length = _newPlayerCards.length;
    }

    function findFours(address _player, uint _numberOfJokersToUse) public returns(string[] memory) {
        require(_numberOfJokersToUse <= _players[_player].numberOfJokers);

        Card[] _playerCards;

        for(uint index = 0; index < _players[_player].cards.length; index++) {
            _playerCards.push(_players[_player].cards[index]);
        }
        
        var _foundFours = _findFours(_player, _playerCards, _numberOfJokersToUse);
        _removeFours(_player, _foundFours);
        
        return _foundFours;
    }

    function teardownGame() public hasGameFinished returns (address, uint256){
        address _winningPlayer = address(0x0);
        uint maxFours = 0;

        for(uint i = 0; i < _numberOfPlayers; i++){
            if (_players[_playersIndex[i]].numberOfFours > maxFours) {
                _winningPlayer = _playersIndex[i];
                maxFours = _players[_playersIndex[i]].numberOfFours;
            }
        }
        
        _isGameRunning = false;
        
        emit PlayerWithdrawal(address(this), _winningPlayer, _winBalance);
        return (_winningPlayer, _winBalance);
    }

    function closeGame() public hasGameFinished areThereNoPlayers {
        _currentPlayer = address(0x0);
        _numberOfPlayers = 0;
        _winBalance = 0;
        
        for(uint i = 0; i < _allCards.length; i++) {
            _moreCards.push(_allCards[i]);
        }
    }

    function getPlayerCards(address _player) public view isCurrentPlayer(_player) returns (Card[]) {
        Card[] _playerCards;
        
        for(uint j = 0; j < _players[_player].cards.length; j++) {
            _playerCards.push(_players[_player].cards[j]);
        }
        
        return _playerCards;
    }

    function getPlayerCardsHashes(address _player) public returns (bytes32[] memory) {
        Card[] _playerCards;
        
        for(uint tempIndex = 0; tempIndex < _players[_player].cards.length; tempIndex++) {
            _playerCards.push(_players[_player].cards[tempIndex]);
        }
        
        bytes32[] storage _hashes;

        for(uint index = 0; index < _playerCards.length; index++) {
            _hashes.push(getHash(_playerCards[index]));
        }

        return _hashes;
    }

    function getPrettyPlayerCards(address _player) public isCurrentPlayer(_player) returns (string[] memory) {
        Card[] _playerCards;
        
        for(uint tempIndex = 0; tempIndex < _players[_player].cards.length; tempIndex++) {
            _playerCards.push(_players[_player].cards[tempIndex]);
        }
        
        string[] _cards;

        for(uint index = 0; index < _playerCards.length; index++) {
            Card _card = _playerCards[index];
            string memory _cardStr = strings.concat(strings.toSlice(strings.concat(strings.toSlice(_card.name), strings.toSlice(", "))), strings.toSlice(_card.family));
            _cards.push(_cardStr);
        }

        return _cards;
    }

    function swapCards(address _playerToSwapWith) public {
        require(_players[msg.sender].numberOfSwappers > 0, "Can not use swapper if have no swappers.");
        
        Card[] _senderCards;
        
        for(uint i = 0; i < _players[msg.sender].cards.length; i++) {
            _senderCards.push(_players[msg.sender].cards[i]);
        }
        
        Card[] _swappedCards;
        
        for(uint j = 0; j < _players[_playerToSwapWith].cards.length; j++) {
            _swappedCards.push(_players[_playerToSwapWith].cards[j]);
        }
        
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

    function getHashForCard(string memory _name) public view returns (bytes32){
        for(uint index = 0; index < _allCards.length; index++) {
            if(StringUtils.equal(_allCards[index].name,  _name)) {
                return getHash(_allCards[index]);
            }
        }
        revert("Can not find requested card");
    }

    function goToNextPlayer(address _player) public {
        _currentPlayer = _player;
    }
    
    function getPlayersNames() public view returns(string[]) {
        string[] storage _playersNames;
        
        for(uint i = 0; i<_numberOfPlayers; i++){
            _playersNames.push(_players[_playersIndex[i]].name);
        }
        
        return _playersNames;
    }
    
    function isGameRunning() public view returns (bool) {
        return _isGameRunning;
    }
}