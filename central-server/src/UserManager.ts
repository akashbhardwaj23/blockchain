

interface Miner {
    id : string,
    isMiner : boolean,

}

export class UserManager {
    private static instance : UserManager
    public miner :Miner[]
    public users : string[]
    public usersToWebsocket : Map<Miner[], WebSocket>
    public socketToUsers : Map<WebSocket, Miner[]>
    private constructor(){
        this.miner = [],
        this.users = []
        this.usersToWebsocket = new Map<Miner[], WebSocket>()
        this.socketToUsers = new Map<WebSocket, Miner[]>()
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new UserManager()
        }

        return this.instance
    }

    join(id : string, isMiner : boolean){
       if(isMiner){
        this.miner.push({id , isMiner});
       } else {
        this.users.push(id)
       }
    }
}
