pragma solidity ^0.5.0;

import "./ERC20.sol";
import "../Ownable/Ownable.sol";

contract QuartetCoin is ERC20, Ownable {

    function () external {
        //if ether is sent to this address, send it back.
        revert("if ether is sent to this address, send it back.");
    }

    /* Public variables of the token */
    string private _name;
    uint8 private _decimals;
    string private _symbol;
    string public version = 'H1.0';

    constructor() public {
        _name = "QuartetCoin";
        _decimals = 6;
        _symbol = "QUARTET";

        // Set the totalSupply amount and move everything to creator
        _mint(msg.sender, 100000000000000);
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei.
     *
     * > Note that this information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * `IERC20.balanceOf` and `IERC20.transfer`.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }
}
