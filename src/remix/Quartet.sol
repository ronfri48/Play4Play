// TODO: Add optional families and fix findFours


pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

// import "./Card.sol";
import "./strings.sol";

contract Quartet {

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
        mapping(string => uint8) foursCounters;
    }

    mapping(address => Player) private _players;
    mapping (uint256 => address) private _playersIndex;
    address private _currentPlayer;
    uint256 private _numberOfPlayers;
    uint256 private _winBalance;
    uint256 private _ethLimit = 1000000000000 wei;
    uint256 private _jokerPrice = 2 wei;
    uint256 private _watcherPrice = 3 wei;
    uint256 private _swapperPrice = 4 wei;
    Card[] private _moreCards;
    Card[] private _allCards;
    bool private _isGameRunning = false;
    string[] private _optionalCardFamilies;


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
    
    function _setup() internal {
        _currentPlayer = address(0x0);
        _numberOfPlayers = 0;
        _winBalance = 0;

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
        
        //Those cards are commented out because declaring them causes the transaction fee to oversize the max gas limit.
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

    ///******constructor********///
    constructor() payable public {
        _setup();
        _optionalCardFamilies.push("Banks");
        _optionalCardFamilies.push("BasketBallTeams");
        _optionalCardFamilies.push("Celebs");
        _optionalCardFamilies.push("Cities");
    }


    ///*********fallback - Unused***********///
    function () external isValidAddr payable {
        revert("Don't do bugs.");
    }

    ///************regsiter to game*************///
    function registerIntoGame(string memory _playerName) public isValidAddr isThereFreePlace payable returns (string memory) {
        //make sure contract cannot accept more than ether limit
        require((_winBalance + msg.value) <= _ethLimit, "Too much Ether!");

        // For every player - add 1 to the winning prize
        _winBalance += 1;

        // Create player
        Player storage _player;
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

        if(_numberOfPlayers == 4) {
            _isGameRunning = true;
        }

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
        Card storage _card = _moreCards[_randIndex];
        _popCard(_randIndex);

        return _card;
    }

    function addCardToPlayer(address _player, Card _card) internal isPlayer(_player) {
        _players[_player].cards.push(_card);
        _players[_player].foursCounters[_card.family]++;
    }

    function doesPlayerHaveCard(address _player, string memory _cardName) internal view isPlayer(_player) returns (bool) {
        for(uint i = 0; i < _players[_player].cards.length; i++){
            if (StringUtils.equal(_cardName, _players[_player].cards[i].name)) {
                return true;
            }
        }

        return false;
    }

    function doesPlayerHasCardFromFamily(address _player, string memory _cardName) view internal isPlayer(_player) returns (bool) {
        string memory _cardFamily;

        for(uint i = 0; i<_allCards.length; i++) {
            if (StringUtils.equal(_cardName, _allCards[i].name)) {
                _cardFamily = _allCards[i].family;
                break;
            }
        }

        for(uint j = 0; j < _players[_player].cards.length; j++) {
            if (StringUtils.equal(_cardFamily, _players[_player].cards[j].family)) {
                return true;
            }
        }

        return false;
    }

    function getCardFromPlayer(address _player, string memory _cardName) internal isPlayer(_player) returns (Card) {
        require(doesPlayerHasCardFromFamily(msg.sender, _cardName), "You can not ask about a family you don't have");
        require(doesPlayerHaveCard(_player, _cardName), "Src Player does not have the card");
        
        Card[] memory _playerCards = new Card[](_players[_player].cards.length);

        for(uint tempIndex = 0; tempIndex < _players[_player].cards.length; tempIndex++) {
            _playerCards[tempIndex] = _players[_player].cards[tempIndex];
        }

        //Card _cardToMove;
        for(uint i = 0; i < _playerCards.length; i++){
            if (StringUtils.equal(_cardName, _playerCards[i].name)) {
               Card memory _cardToMove = _playerCards[i];

                // Update source cards
                _playerCards[i] = _playerCards[_playerCards.length-1];
                delete _playerCards[_playerCards.length-1];

                for(uint j = 0; j < _playerCards.length; j++) {
                    _players[_player].cards.push(_playerCards[j]);
                }
                
                _players[_player].foursCounters[_cardToMove.family]--;

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
        for(uint i = 0; i < _numberOfPlayers; i++){
            while (_players[_playersIndex[i]].cards.length < 4) {
                addCardToPlayer(_playersIndex[i], popCardFromCenter());
            }
        }
    }

    function _findFours(address _player, uint _numberOfJokersToUse) internal returns(string[] memory) {
        string[] memory _foundFours = new string[](_optionalCardFamilies.length);
        uint8 _foundFoursIndex = 0;
        
        for(uint8 familiesIndex = 0; familiesIndex < _optionalCardFamilies.length; familiesIndex++)
        {
            uint8 _familyCounter = _players[_player].foursCounters[_optionalCardFamilies[familiesIndex]];
            if(_familyCounter + _numberOfJokersToUse >= 4) {
                if (_familyCounter < 4) {
                    _numberOfJokersToUse = _numberOfJokersToUse - (4 - _familyCounter);
                    _players[_player].numberOfJokers = _players[_player].numberOfJokers - (4 - _familyCounter);
                    emit JokerUsed(_player);
                }
                
                emit FourFound(_player, _optionalCardFamilies[familiesIndex]);
                _foundFours[_foundFoursIndex] = _optionalCardFamilies[familiesIndex];
                _foundFoursIndex++;

                _players[_player].numberOfFours++;
            }
        }
        
        string[] memory _actualFoundFours = new string[](_foundFoursIndex + 1);
        for(uint8 i = 0; i < _foundFoursIndex + 1; i++) {
            _actualFoundFours[i] = _foundFours[i];
        }
        
        return _actualFoundFours;
    }
    
    function _removeFours(address _player, string[] memory _foundFours) internal {
        Card[] memory _newPlayerCards = new Card[](_players[_player].cards.length);
        uint8 _newPlayerCardsIndex = 0;
        
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
                _newPlayerCards[_newPlayerCardsIndex] = _players[_player].cards[k];
                _newPlayerCardsIndex++;
            }
        }
        
        _players[_player].cards.length = 0;
        
        for(uint i = 0; i < _newPlayerCardsIndex + 1; i++) {
            _players[_player].cards.push(_newPlayerCards[i]);
        }

        _players[_player].cards.length = _newPlayerCardsIndex + 1;
    }

    function findFours(address _player, uint _numberOfJokersToUse) public returns(string[] memory) {
        require(_numberOfJokersToUse <= _players[_player].numberOfJokers);
        
        string[] memory _foundFours = _findFours(_player, _numberOfJokersToUse);
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

    function closeGame() public payable hasGameFinished areThereNoPlayers {
        _setup();
    }

    function getPlayerCards(address _player) public view isCurrentPlayer(_player) returns (Card[]) {
        return _players[_player].cards;
    }

    function getPlayerCardsHashes(address _player) public view returns (bytes32[] memory) {
        bytes32[] memory _hashes = new bytes32[](_players[_player].cards.length);

        for(uint index = 0; index < _players[_player].cards.length; index++) {
            _hashes[index] = getHash(_players[_player].cards[index]);
        }

        return _hashes;
    }

    function swapCards(address _playerToSwapWith) public {
        require(_players[msg.sender].numberOfSwappers > 0, "Can not use swapper if have no swappers.");

        Card[] memory _swappedCards = new Card[](_players[_playerToSwapWith].cards.length);

        for(uint j = 0; j < _players[_playerToSwapWith].cards.length; j++) {
            _swappedCards[j] = _players[_playerToSwapWith].cards[j];
        }

        emit SwapperUsed(msg.sender, _playerToSwapWith);
        _players[msg.sender].numberOfSwappers--;
    }

    function watchCards(address _playerToWatch) public returns(Card[] memory) {
        require(_players[msg.sender].numberOfWatchers > 0, "Can not use watcher if have no watchers.");

        emit WatcherUsed(msg.sender, _playerToWatch);
        _players[msg.sender].numberOfWatchers--;
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

    function goToNextPlayer(address _player) isCurrentPlayer(msg.sender) public {
        _currentPlayer = _player;
    }

    function getPlayersNames() public view returns(string[]) {
        string[] memory _playersNames = new string[](4);

        for(uint i = 0; i<_numberOfPlayers; i++){
            _playersNames[i] = _players[_playersIndex[i]].name;
        }

        return _playersNames;
    }

    function isGameRunning() public view returns (bool) {
        return _isGameRunning;
    }
}