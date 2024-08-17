import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { UserManager } from "./UserManager";



dotenv.config()
const app = express();
app.use(express.json())
app.use(cors())
const server = createServer(app)

const wss = new WebSocketServer({server});

wss.on("connection", (ws) => {
    ws.on("error", (e) => {
        console.log("error")
    })

    ws.on("message", (data:string) => {
        const message = JSON.parse(data);
        if(message.type === "join"){
            if(message.isMiner){
                UserManager.getInstance().join(message.id, true, ws)
            } else {
                UserManager.getInstance().join(message.id, false, ws)
            }
        }

        if(message.type === "BLOCK_MINED"){
            UserManager.getInstance().broadcast(message.id, message.data)
        }
    })
})


server.listen(process.env.PORT, () => {
    console.log(`Server Running at Port ${process.env.PORT}`)
})

