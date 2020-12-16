// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var SquareVerifier = artifacts.require('SquareVerifier');

// Test verification with correct proof
// - use the contents from proof.json generated from zokrates steps
contract('TestSquareVerifier', accounts => {
  const account_three = accounts[2];
  const proofJson = require('../../zokrates/code/square/proof.json');

  describe('test verification', function() {
    beforeEach(async function() {
      this.contract = await SquareVerifier.new({from: account_three });
    })

    it ('with correct proof', async function () {
      const verificationResult = await this.contract.verifyTx(proofJson.proof.a, proofJson.proof.b, proofJson.proof.c, proofJson.inputs, { from: account_three });

      assert.equal(verificationResult, true);
    })

    // Test verification with incorrect proof
    it ('with incorrect proof', async function () {
      const verificationResult = await this.contract.verifyTx(proofJson.proof.a, proofJson.proof.b, proofJson.proof.c,
        [
          "0x0000000000000000000000000000000000000000000000000000000000000003",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ], { from: account_three });

      assert.equal(verificationResult, false);
    })
  });
});