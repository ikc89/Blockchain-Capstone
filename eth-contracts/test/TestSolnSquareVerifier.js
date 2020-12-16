var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var SquareVerifier = artifacts.require('SquareVerifier');

contract('TestSolnSquareVerifier', accounts => {
  const account_one = accounts[0];
  const proofJson = require('../../zokrates/code/square/proof.json');

  describe('test SolnSquareVerifier', function() {
    beforeEach(async function() {
      const squareVerifierContract = await SquareVerifier.new( {from: account_one});
      this.contract = await SolnSquareVerifier.new(squareVerifierContract.address, {from: account_one});
    })

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('new solution can be added', async function() {
      const uniqueKey = await this.contract.createUniqueKey(proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, proofJson.inputs);
      await this.contract.addSolution(1, account_one, uniqueKey);
      const solutionAddress = await this.contract.getUniqueSolutionAddress(uniqueKey);

      assert.equal(solutionAddress, account_one);
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('ERC721 token can be minted', async function() {
      await this.contract.mintWithVerification(1, account_one, proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, [
        "1",
        "1"
      ], {from: account_one});
      const accountOneBalance = await this.contract.balanceOf(account_one);
      const totalSupply = await this.contract.totalSupply();

      assert.equal(accountOneBalance, 1);
      assert.equal(totalSupply, 1);
    })
  })
});
