import crypto from "crypto"

export class BlockChain{
    private static instance : BlockChain
    public blockchainLength : number
    public blockChain : Block[]
    public pendingTransaction : string[]

    private constructor(){
        this.blockChain = [this.createGenesisBlock()]
        this.blockchainLength = 0;
        this.pendingTransaction = []
    }

    getInstance(){
        if(!BlockChain.instance){
            return new BlockChain();
        }

        return BlockChain.instance
    }

    createGenesisBlock(){
        return new Block("0000000000000000000000000",[], Date.now(), 0)
    }

    getLatestBlockHash(){
        return this.blockChain[this.blockChain.length - 1].blockHash;
    }

    getData(blockNumber : number){
        const data = this.blockChain[blockNumber].transactions;
        return data
    }

    getBalance(publicKey : string){

    }
    
}


class Transactions {
    public fromAddress : string
    public toAddress : string
    public amount : number
    public signature : string

    constructor(fromAddress : string, toAddress : string, amount : number, signature : string){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress
        this.amount = amount
        this.signature = signature
    }

    calculateHash(){
        return crypto.createHash('sha256').update(
            this.fromAddress + this.toAddress + this.amount
        ).digest().toString()
    }

    signTransaction(signingKey : any){
        if(signingKey.getPublicKey('hex') !== this.fromAddress){
            return Error("You cannot sign the transaction of other")
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base664');
        this.signature = sig.toDER('hex')
    }


    verifyTransaction(){
        if(this.fromAddress === null) return
        if(!this.signature) return null
        const data = Buffer.from(this.fromAddress + this.toAddress + this.amount)
        const verifier = crypto.createVerify ('sha256').update(this.fromAddress + this.toAddress + this.amount);
        const verify = verifier.verify(this.fromAddress, this.signature);
        if(verify){
            return true
        }

        return false
    }
}



// defination of a block 

 class Block {
    public blockNumber : number
    public transactions : Transactions[]
    public previousHash : string
    public blockHash : string
    public nounce: number
    public timeStamp: number
    public isMined : boolean
    constructor(previousHash:string, data:Transactions[], timeStamp : number, blockNumber : number){
        this.previousHash = previousHash
        this.blockNumber = blockNumber
        this.transactions = data
        this.blockHash = this.calculateHash()
        this.nounce = 0;
        this.timeStamp = timeStamp
        this.isMined = false
    }

    calculateHash(){
        const hash = crypto.createHash("sha256").update(
            this.previousHash +
            this.blockNumber + this.transactions + this.nounce
        ).digest().toString()

        return hash
    }
    mineBlock(){
        const difficulty = 4
        while(this.blockHash.substring(0,difficulty) != Array(difficulty + 1).join("")){
            const hash = this.calculateHash();
            this.blockHash = hash
        }

        console.log('Block is Mined')
    }

}
