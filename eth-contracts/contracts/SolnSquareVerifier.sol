pragma solidity >=0.4.21 <0.6.0;

import './Verifier.sol';
import './ERC721Mintable.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is MyMintableERC721Token 
{
  SquareVerifier private _verifier;

  constructor(address verifierAddress) public {
    _verifier = SquareVerifier(verifierAddress);
  }

// TODO define a solutions struct that can hold an index & an address
  struct Solution {
    uint256 index;
    address to;
  }

// TODO define an array of the above struct
  Solution[] private _solutions;

// TODO define a mapping to store unique solutions submitted
  mapping (bytes32 => Solution) private _uniqueSolutions;

// TODO Create an event to emit when a solution is added
  event SolutionAdded(uint256 tokenId, address to);

  function getUniqueSolutionAddress(bytes32 uniqueKey) public view returns (address) {
    return _uniqueSolutions[uniqueKey].to;
  }

  function createUniqueKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) pure public returns (bytes32) {
    return keccak256(abi.encodePacked(a, b, c, input));
  }

// TODO Create a function to add the solutions to the array and emit the event
  function addSolution(uint256 tokenId, address to, bytes32 uniqueKey) public {
    Solution memory solution = Solution({ index: tokenId, to: to });

    _solutions.push(solution);
    _uniqueSolutions[uniqueKey] = solution;

    emit SolutionAdded(tokenId, to);
  }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
  function mintWithVerification(uint256 tokenId, address to, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
    bytes32 uniqueKey = createUniqueKey(a, b, c, input);
    require(_uniqueSolutions[uniqueKey].to == address(0), "Unique solution address not empty");
    require(_verifier.verifyTx(a, b, c, input), "Solution is wrong.");

    addSolution(tokenId, to, uniqueKey);
    super.mint(to, tokenId);
  }
}