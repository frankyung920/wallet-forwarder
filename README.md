# Solidity API

This project is to create forwarder address contracts which has the ability to flush funds that were sent to the address before the contract was created. And a forwarder management contract to manage the forwarder address.

## CustomArray

_A library for creating custom array library for saving gas cost_

### removeElementFromArray

```solidity
function removeElementFromArray(address[] arr, address toRemove) public returns (address[])
```

### findIndex

```solidity
function findIndex(address[] arr, address addr) public pure returns (uint256)
```

## Forwarder

Forwarder
=========

A forwarder contract which forward any incoming tokens to a pre-assigned destinated address

### parentAddress

```solidity
address parentAddress
```

### flushToAddress

```solidity
address flushToAddress
```

### ForwarderDeposited

```solidity
event ForwarderDeposited(address parent, address flushTo, address from, uint256 value)
```

### UpdateFlushToAddress

```solidity
event UpdateFlushToAddress(address _old, address _new)
```

### constructor

```solidity
constructor(address _flushToAddress) public
```

Create the contract, and sets the destination address to that of the creator

### onlyParent

```solidity
modifier onlyParent()
```

Modifier that will execute internal code block only if the sender is the parent address

### receive

```solidity
receive() external payable
```

Default receive function for handling incoming tokens

### flushTokens

```solidity
function flushTokens(address tokenContractAddress, address toAddress) public
```

Execute a token transfer of the full balance from the forwarder token to the parent address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenContractAddress | address | the address of the erc20 token contract |
| toAddress | address |  |

### flush

```solidity
function flush(address toAddress) public
```

It is possible that funds were sent to this address before the contract was deployed.
We can flush those funds to the parent address.

### updateFlushToAddress

```solidity
function updateFlushToAddress(address addr) public
```

Update flush to address that the forwarder flush to

## ForwarderManagement

Forwarder Management
=========

A forwarder management contract which has below functions
 - Create forwarder
 - Add/Remove flusher which can flush tokens in forwarder to valid "Flush To" address
 - Add/Remove valid "Flush To" address
 - Flush tokens in forwarder to valid "Flush To" address

### AddFlushToAddress

```solidity
event AddFlushToAddress(address addr)
```

### RemoveFlushToAddress

```solidity
event RemoveFlushToAddress(address addr)
```

### AddFlusher

```solidity
event AddFlusher(address addr)
```

### RemoveFlusher

```solidity
event RemoveFlusher(address addr)
```

### FlushFowarderTokens

```solidity
event FlushFowarderTokens(address tokenContractAddress, address flushToAddress, address forwarderAddress)
```

### DepositTransaction

```solidity
event DepositTransaction(address tokenContractAddress, address flushToAddress, address forwarderAddress)
```

### flushers

```solidity
address[] flushers
```

### onlyAdmin

```solidity
modifier onlyAdmin()
```

Only address which is set to Admin role can call functions with this modifier

### onlyAdminOrFlusher

```solidity
modifier onlyAdminOrFlusher()
```

Only address which is in flusher list can call functions with this modifier

### createForwarder

```solidity
function createForwarder(address flushToAddress) public virtual returns (address)
```

Create a new contract (and also address) that forwards funds to this contract
 @param flushToAddress address that the forwarder flush to
returns address of newly created forwarder address

### addFlusher

```solidity
function addFlusher(address addr) public virtual
```

Add address which can call {flushFowarderTokens}

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | address to be added to flushers |

### removeFlusher

```solidity
function removeFlusher(address addr) public virtual
```

Remove address which can allow forwarder address to flush tokens to

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | address to be removed from flushers; |

### addValidFlushToAddress

```solidity
function addValidFlushToAddress(address addr) public virtual
```

Add address which can allow forwarder address to flush tokens to

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | address to be added to valid "flush to" address |

### removeValidFlushToAddress

```solidity
function removeValidFlushToAddress(address addr) public virtual
```

Remove address which can allow forwarder address to flush tokens to

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | address to be removed from valid "flush to" address |

### getGasTankBalance

```solidity
function getGasTankBalance() public view virtual returns (uint256)
```

Get gas tank balance

### flushFowarderTokens

```solidity
function flushFowarderTokens(address tokenContractAddress, address flushToAddress, address payable forwarderAddress) public virtual
```

Flush forwarder tokens to a valid "flush to" address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenContractAddress | address | token contract address |
| flushToAddress | address | the address the tokens flush to |
| forwarderAddress | address payable | forwarder address |

## ReentrancyGuard

### locked

```solidity
bool locked
```

### noReentrant

```solidity
modifier noReentrant()
```

