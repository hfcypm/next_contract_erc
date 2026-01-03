//测试ERC20 Token
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC20Token is ERC20, Ownable {
    constructor() ERC20("MyERC20Token", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, 1000 ether);
    }

    function mint(address _to, uint256 amount) public onlyOwner {
        _mint(_to, amount);
    }
}
