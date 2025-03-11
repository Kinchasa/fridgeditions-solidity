// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title FridgeditionsNFT
 * @dev ERC1155 contract for Fridgeditions platform
 * Supports both 1/1 and multiple editions with gasless transactions
 */
contract FridgeditionsNFT is ERC1155, ERC1155Supply, Ownable, ERC2771Context {
    using Strings for uint256;

    // Token counter for unique IDs
    uint256 private _tokenIdCounter;
    
    // Base URI for metadata
    string private _baseURI;
    
    // Mapping from token ID to max supply
    mapping(uint256 => uint256) private _maxSupply;
    
    // Mapping from token ID to current supply
    mapping(uint256 => uint256) private _currentSupply;
    
    // Mapping from token ID to price
    mapping(uint256 => uint256) private _prices;
    
    // Mapping from token ID to artist address
    mapping(uint256 => address) private _artists;
    
    // Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;

    // Events
    event ArtworkCreated(uint256 indexed tokenId, address indexed artist, uint256 maxSupply, uint256 price);
    event ArtworkMinted(uint256 indexed tokenId, address indexed to, uint256 amount);
    event PriceUpdated(uint256 indexed tokenId, uint256 price);

    /**
     * @dev Constructor
     * @param trustedForwarder Address of the trusted forwarder for meta-transactions
     * @param baseURI Base URI for token metadata
     */
    constructor(address trustedForwarder, string memory baseURI) 
        ERC1155(baseURI) 
        Ownable(msg.sender)
        ERC2771Context(trustedForwarder) 
    {
        _baseURI = baseURI;
        _tokenIdCounter = 1; // Start from 1
    }

    /**
     * @dev Create a new artwork
     * @param artist Address of the artist
     * @param maxSupply Maximum supply of the token (1 for 1/1 NFTs)
     * @param price Price of the token in wei (0 for free)
     * @param metadataURI URI for the token metadata
     * @return tokenId The ID of the created token
     */
    function createArtwork(
        address artist,
        uint256 maxSupply,
        uint256 price,
        string memory metadataURI
    ) external returns (uint256) {
        require(maxSupply > 0, "Max supply must be greater than 0");
        
        uint256 tokenId = _tokenIdCounter++;
        
        _maxSupply[tokenId] = maxSupply;
        _currentSupply[tokenId] = 0;
        _prices[tokenId] = price;
        _artists[tokenId] = artist;
        _tokenURIs[tokenId] = metadataURI;
        
        emit ArtworkCreated(tokenId, artist, maxSupply, price);
        
        return tokenId;
    }

    /**
     * @dev Mint tokens
     * @param to Address to mint tokens to
     * @param tokenId ID of the token to mint
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 tokenId, uint256 amount) external payable {
        require(_exists(tokenId), "Token does not exist");
        require(_currentSupply[tokenId] + amount <= _maxSupply[tokenId], "Exceeds max supply");
        
        // If price is not 0, require payment
        if (_prices[tokenId] > 0) {
            require(msg.value >= _prices[tokenId] * amount, "Insufficient payment");
            
            // Send payment to artist
            (bool success, ) = _artists[tokenId].call{value: msg.value}("");
            require(success, "Transfer to artist failed");
        }
        
        _mint(to, tokenId, amount, "");
        _currentSupply[tokenId] += amount;
        
        emit ArtworkMinted(tokenId, to, amount);
    }

    /**
     * @dev Mint tokens (gasless)
     * @param to Address to mint tokens to
     * @param tokenId ID of the token to mint
     * @param amount Amount of tokens to mint
     */
    function mintGasless(address to, uint256 tokenId, uint256 amount) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(_currentSupply[tokenId] + amount <= _maxSupply[tokenId], "Exceeds max supply");
        
        _mint(to, tokenId, amount, "");
        _currentSupply[tokenId] += amount;
        
        emit ArtworkMinted(tokenId, to, amount);
    }

    /**
     * @dev Update price of a token
     * @param tokenId ID of the token
     * @param price New price in wei
     */
    function updatePrice(uint256 tokenId, uint256 price) external {
        require(_exists(tokenId), "Token does not exist");
        require(_msgSender() == _artists[tokenId] || _msgSender() == owner(), "Not authorized");
        
        _prices[tokenId] = price;
        
        emit PriceUpdated(tokenId, price);
    }

    /**
     * @dev Get token URI
     * @param tokenId ID of the token
     * @return URI for the token metadata
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Set base URI
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseURI = newBaseURI;
    }

    /**
     * @dev Get max supply of a token
     * @param tokenId ID of the token
     * @return Max supply of the token
     */
    function maxSupply(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Query for nonexistent token");
        return _maxSupply[tokenId];
    }

    /**
     * @dev Get current supply of a token
     * @param tokenId ID of the token
     * @return Current supply of the token
     */
    function currentSupply(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Query for nonexistent token");
        return _currentSupply[tokenId];
    }

    /**
     * @dev Get price of a token
     * @param tokenId ID of the token
     * @return Price of the token in wei
     */
    function price(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Query for nonexistent token");
        return _prices[tokenId];
    }

    /**
     * @dev Get artist of a token
     * @param tokenId ID of the token
     * @return Address of the artist
     */
    function artist(uint256 tokenId) external view returns (address) {
        require(_exists(tokenId), "Query for nonexistent token");
        return _artists[tokenId];
    }

    /**
     * @dev Check if a token exists
     * @param tokenId ID of the token
     * @return True if the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId < _tokenIdCounter;
    }

    /**
     * @dev Override for ERC2771Context
     */
    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    /**
     * @dev Override for ERC2771Context
     */
    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    /**
     * @dev Override for ERC1155Supply
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}

