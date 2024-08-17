import { WebSocket } from "ws"

interface Miner {
    id : string,
    isMiner : boolean,
}

export class UserManager {
    private static instance : UserManager
    public miner :Miner[]
    public users : string[]
    public minersToSocket : Map<Miner, WebSocket>
    // public socketToMiners : Map<WebSocket, Miner>
    private constructor(){
        this.miner = [],
        this.users = []
        this.minersToSocket = new Map<Miner, WebSocket>()
        // this.socketToMiners = new Map<WebSocket, Miner>()
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new UserManager()
        }

        return this.instance
    }

    join(id : string, isMiner : boolean, socket:WebSocket){
       if(isMiner){ 
        this.miner.push({id , isMiner});
        this.minersToSocket.set({
            id,
            isMiner
        }, socket);
        // this.socketToMiners.set(socket, {
        //     id , 
        //     isMiner
        // })
       } else {
        this.users.push(id)
       }
    }

    remove(id : string, isMiner : boolean){
        if(isMiner){
            const miners = this.miner.filter(x => x.id !== id);
            this.miner = miners;
            this.minersToSocket.delete({
                id ,
                isMiner
            });
        }
    }

    getUser(userId : string){
        const user = this.miner.map(({id}) => id === userId);
        if(!user){
            return null
        }

        return user
    }

    broadcast(id: string, message : string){
        const user = this.getUser(id);
        this.minersToSocket.forEach((socket, miner) => {
            if(id === miner.id){
                return
            }
            socket.send(JSON.stringify(message))
        })
    }
}
