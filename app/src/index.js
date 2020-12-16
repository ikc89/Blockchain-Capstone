import Web3 from "web3";
import solnSquareVerifierArtifact from "../../eth-contracts/build/contracts/SolnSquareVerifier.json";
import { proof, inputs } from "../../zokrates/code/square/proof.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = solnSquareVerifierArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        solnSquareVerifierArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  setTotalSupply: function(message) {
    const totalSupply = document.getElementById("totalSupply");
    totalSupply.innerHTML = message;
  },

  mintWithVerification: async function() {
    const { mintWithVerification } = this.meta.methods;
    const id = document.getElementById("tokenId").value;
    await mintWithVerification(id, this.account, proof.a, proof.b, proof.c, inputs).send({from: this.account});
    App.setStatus("New Token Owner is " + this.account + ".");
  },

  showTotalSupply: async function() {
    const { totalSupply } = this.meta.methods;
    const tokenCount = await totalSupply().call();
    App.setTotalSupply("Total Supply is: " + tokenCount + ".");
  },

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/..................."),);
  }

  App.start();
});