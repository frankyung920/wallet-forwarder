// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ReentrancyGuard.sol";

/**
 * Forwarder
 * =========
 * 
 * A forwarder contract which forward any incoming tokens to a pre-assigned destinated address
 * 
 */

contract Forwarder is ReentrancyGuard {
    
  // Address to which any funds sent to this contract will be forwarded
  address public immutable parentAddress;
  address public flushToAddress; 
  event ForwarderDeposited(address parent, address flushTo, address from, uint256 value);
  event UpdateFlushToAddress(address _old, address _new);

  /**
   * Create the contract, and sets the destination address to that of the creator
   */
  constructor(address _flushToAddress) {
    parentAddress = msg.sender;
    flushToAddress = _flushToAddress;
  }

  /**
   * Modifier that will execute internal code block only if the sender is the parent address
   */
  modifier onlyParent {
    if (msg.sender != parentAddress) {
      revert();
    }
    _;
  }

  /**
   * Get parent address that the forwarder flush to
   */
  function getParentAddress() public view returns (address) {
    return parentAddress;
  }

  /**
   * Default receive function for handling incoming tokens
   */
  receive() external payable noReentrant { 
    // throws on failure if the address is not payable
    payable(flushToAddress).transfer(msg.value);
    // Fire off the deposited event if we can forward it
    emit ForwarderDeposited(parentAddress, flushToAddress, msg.sender, msg.value);
  }

  /**
   * Execute a token transfer of the full balance from the forwarder token to the parent address
   * @param tokenContractAddress the address of the erc20 token contract
   */
  function flushTokens(address tokenContractAddress, address toAddress) public onlyParent {
    IERC20 instance = IERC20(tokenContractAddress);
    uint256 forwarderBalance = instance.balanceOf(address(this));
    if (forwarderBalance == 0) {
      return;
    }
    if (!instance.transfer(toAddress, forwarderBalance)) {
      revert();
    }
  }

  /**
   * It is possible that funds were sent to this address before the contract was deployed.
   * We can flush those funds to the parent address.
   */
  function flush(address toAddress) public onlyParent {
    require(address(0) != toAddress, "Forwarder: flush to address is a zero address");
    // throws on failure if the address is not payable
    payable(toAddress).transfer(address(this).balance);
  }

  /**
   * Update flush to address that the forwarder flush to
   */
  function updateFlushToAddress(address addr) public onlyParent {
    require(address(0) != addr, "Forwarder: new address is a zero address");
    emit UpdateFlushToAddress(flushToAddress, addr);
    flushToAddress = addr;
  }

  /**
   * Get flush to address that the forwarder flush to
   */
  function getFlushToAddress() public view returns (address) {
    return flushToAddress;
  }
}
