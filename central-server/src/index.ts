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
       
        handleMessage(message.type){
            
        }
    })
})


server.listen(process.env.PORT, () => {
    console.log(`Server Running at Port ${process.env.PORT}`)
})

