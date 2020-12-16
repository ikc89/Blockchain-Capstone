var ERC721MintableComplete = artifacts.require('MyMintableERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, {from: account_one});
            await this.contract.mint(account_one, 2, {from: account_one});
            await this.contract.mint(account_two, 3, {from: account_one});
        })

        it('should return total supply', async function () { 
            const totalSupply =  await this.contract.totalSupply();

            assert.equal(totalSupply, 3);
        })

        it('should get token balance', async function () { 
            const accountOneBalance = await this.contract.balanceOf(account_one);
            const accountTwoBalance = await this.contract.balanceOf(account_two);

            assert.equal(accountOneBalance, 2);
            assert.equal(accountTwoBalance, 1);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            const firstTokenURI = await this.contract.tokenURI(1); 
            const secondTokenURI = await this.contract.tokenURI(2); 

            assert.equal(firstTokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1');
            assert.equal(secondTokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2');
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 1, { from: account_one });
            const newOwnerAddress = await this.contract.ownerOf(1);
            const accountOneBalance = await this.contract.balanceOf(account_one);
            const accountTwoBalance = await this.contract.balanceOf(account_two);

            assert.equal(newOwnerAddress, account_two);
            assert.equal(accountOneBalance, 1);
            assert.equal(accountTwoBalance, 2);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            try {
                await this.contract.mint(account_one, 1, {from: account_two});
            } catch (err) {
                assert.equal(err.reason, "Caller should be contract owner.");
            }
        })

        it('should return contract owner', async function () { 
            const owner = await this.contract.getOwner(); 

            assert.equal(owner, account_one);
        })

    });
})