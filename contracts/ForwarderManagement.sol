// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./Forwarder.sol";

/**
 * Forwarder Management
 * =========
 * 
 * A forwarder management contract which has below functions
 *  - Create forwarder
 *  - Add/Remove flusher which can flush tokens in forwarder to valid "Flush To" address
 *  - Add/Remove valid "Flush To" address
 *  - Flush tokens in forwarder to valid "Flush To" address
 * 
 */
contract ForwarderManagement is Initializable, AccessControlUpgradeable {

    using CustomArray for address[];

    // Events
    event AddFlushToAddress(address addr);
    event RemoveFlushToAddress(address addr);
    event AddFlusher(address addr);
    event RemoveFlusher(address addr);
    event FlushFowarderTokens(address tokenContractAddress, address flushToAddress, address forwarderAddress);
    event DepositTransaction(address tokenContractAddress, address flushToAddress, address forwarderAddress);
    event ForwarderCreated(address caller, address forwarder);

    // Address(s) that can call {flushFowarderTokens}
    address[] public flushers;

    /** 
     *  @dev For checking flusher address existence
     */
    mapping(address => bool) private flusherExists;

    // Address(s) that can be flushed to 
    address[] private validFlushToAddress;

    /** 
     *  @dev For checking valid flush to address existence
     */
    mapping(address => bool) private validFlushToAddressExist;

    function initialize(address admin, address flushToAddresses) external initializer {
        require(admin != address(0), "ForwarderManagement: Admin address cannot be null");
        require(flushToAddresses != address(0), "ForwarderManagement: Flush to address cannot be null");

        __AccessControl_init_unchained();
        _setupRole(DEFAULT_ADMIN_ROLE, admin);

        validFlushToAddress.push(flushToAddresses);
        validFlushToAddressExist[flushToAddresses] = true;
    }

    /**
     * Only address which is set to Admin role can call functions with this modifier
     */
    modifier onlyAdmin virtual {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ForwarderManagement: Must have ADMIN ROLE");
        _;
    }

    /**
     * Only address which is in flusher list can call functions with this modifier
     */
    modifier onlyAdminOrFlusher virtual {
        require(flusherExists[_msgSender()] || hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ForwarderManagement: Must be either in flusher list or having ADMIN ROLE");
        _;
    }

    /**
     * Create a new contract (and also address) that forwards funds to this contract
     *  @param flushToAddress address that the forwarder flush to
     * returns address of newly created forwarder address
     */
    function createForwarder(address flushToAddress) public virtual returns (address) {
        // Check whether flush to address is valid
        require(validFlushToAddressExist[flushToAddress], "ForwarderManagement: not a valid 'flush to' address");
        Forwarder f = new Forwarder(flushToAddress);
        emit ForwarderCreated(_msgSender(), address(f));
        return address(f);
    }

    /**
     * Add address which can call {flushFowarderTokens}
     * @param addr address to be added to flushers
     */
    function addFlusher(address addr) public virtual onlyAdmin {
        require(!flusherExists[addr], "ForwarderManagement: Address already exists");
        flushers.push(addr);
        flusherExists[addr] = true;
        emit AddFlusher(addr);
    }

    /**
     * Remove address which can allow forwarder address to flush tokens to 
     * @param addr address to be removed from flushers;
     */
    function removeFlusher(address addr) public virtual onlyAdmin {
        require(flusherExists[addr], "ForwarderManagement: Address already removed or doesnt exist");
        flushers.removeElementFromArray(addr);
        flusherExists[addr] = false;
        emit RemoveFlusher(addr);
    }

    /**
     * Add address which can allow forwarder address to flush tokens to 
     * @param addr address to be added to valid "flush to" address
     */
    function addValidFlushToAddress(address addr) public virtual onlyAdmin {
        require(!validFlushToAddressExist[addr], "ForwarderManagement: Address already exists");
        validFlushToAddress.push(addr);
        validFlushToAddressExist[addr] = true;
        emit AddFlushToAddress(addr);
    }

    /**
     * Remove address which can allow forwarder address to flush tokens to 
     * @param addr address to be removed from valid "flush to" address
     */
    function removeValidFlushToAddress(address addr) public virtual onlyAdmin {
        require(validFlushToAddressExist[addr], "ForwarderManagement: Address already removed or doesnt exist");
        validFlushToAddress.removeElementFromArray(addr);
        validFlushToAddressExist[addr] = false;
        emit RemoveFlushToAddress(addr);
    }

    /**
     * Flush forwarder tokens to a valid "flush to" address
     * @param tokenContractAddress token contract address
     * @param flushToAddress the address the tokens flush to 
     * @param forwarderAddress forwarder address
     */
    function flushFowarderTokens(address tokenContractAddress, address flushToAddress, address payable forwarderAddress) public virtual onlyAdminOrFlusher {
        // Check whether flush to address is valid
        require(validFlushToAddressExist[flushToAddress], "ForwarderManagement: not a valid 'flush to' address");
        Forwarder forwarder = Forwarder(forwarderAddress);
        forwarder.flushTokens(tokenContractAddress, flushToAddress);
    }

    /**
     * Check if the address is a flusher
     * @param addr address want to check whether it is a flusher
     * returns true if the address is a flusher
     */
    function isFlusher(address addr) public view virtual returns (bool) {
        return flusherExists[addr];
    }

    /**
     * Check if the address is a valid "flush to" address
     * @param addr address want to check whether is a valid "flush to" address
     * returns true if the address is a valid "flush to" address
     */
    function isValidFlushToAddress(address addr) public view virtual returns (bool) {
        return validFlushToAddressExist[addr];
    }
}

/**
 * A library for creating custom array library for saving gas cost
 */
library CustomArray {
    function findIndex(address[] memory arr, address addr) public pure returns (uint256){
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == addr) {
                return i;
            }
        }
        revert("CustomArray: Element not found");
    }
    function removeElementFromArray(address[] storage arr, address toRemove) public {
        uint256 index = findIndex(arr, toRemove);

        // @dev Overwrite the element that we want to remove with the last element
        arr[index] = arr[arr.length - 1];
        arr.pop(); 
    }

}