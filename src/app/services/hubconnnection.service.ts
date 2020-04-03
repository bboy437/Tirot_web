import { Injectable } from "@angular/core";
import { HubConnectionBuilder } from "@aspnet/signalr";
import { AppConfig } from "../app.config";

@Injectable()
export class HubConnectionService {
    public _hubConnection: any;

    constructor()
    {
      
    }
    
    start() {
        this._hubConnection = new HubConnectionBuilder().withUrl(AppConfig.settings.ServerApiMQUrl).build();  //new HubConnection('http://localhost:1874/notify');
        this._hubConnection
            .start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.log('Error while establishing connection :('));
    }


    stop() {
        console.log("HubConnectionService stop",this._hubConnection);
         
    }

}