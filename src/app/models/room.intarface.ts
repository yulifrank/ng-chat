import { Imessage } from "./"

export interface IChatRoom{
    id:string,
    roomName:string
    messages:Array<Imessage>,
    timestamp:number,
    body:string,
    createdUserId:string
}