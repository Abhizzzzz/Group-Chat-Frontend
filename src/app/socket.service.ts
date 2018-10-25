import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse, HttpParams} from '@angular/common/http';
//Importing observables related code
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
//for cookies
import {Cookie} from 'ng2-cookies/ng2-cookies'; 
// io as socket.io-client
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = 'http://apigroupchat.abhishekpalwankar.xyz/chat'; // server URL
  private socket;

  constructor(public http :HttpClient) { 
    console.log("Socket service");
    // connecting to the server
    // here the handshaking is made
    this.socket = io(this.baseUrl);
  }

  public verifyUSer = () =>{
    let listen = Observable.create((observer) =>{
      this.socket.on('verify-user',(data) =>{
        console.log("Received data from verify-user event");
        observer.next(data);

      });
    });
    return listen;
  };

  public setUser = (authToken) =>{
    this.socket.emit('set-user',authToken);
  };

  public getOnlineUserList = () =>{
    let listen = Observable.create((observer) =>{
      this.socket.on('online-user-list',(userList) =>{
        console.log("Received userList from online-user-list event");
        observer.next(userList);
      });
    });
    return listen;
  };

  public sendMessageFunction = (data) =>{
    this.socket.emit('chat-message',data);
  };

  public typingEmittingEvent = (typerDetails) =>{
    this.socket.emit('typing',typerDetails);
  }
  public typingListeningEvent(): any{
    let listen = Observable.create((observer) =>{
      this.socket.on('typing',(data) =>{
        observer.next(data);
      });
    });
    return listen;
  };

  public getAMessageFunction(userId): any{
    let listen = Observable.create((observer) =>{
      this.socket.on(userId,(data) =>{
        observer.next(data);
      });
    });
    return listen;
  };

  public getGroupMessageFunction(): any{
    let listen = Observable.create((observer) =>{
      this.socket.on('group-message',(data) =>{
        observer.next(data);
      });
    });
    return listen;
  };

  public getChat(senderId,receiverId,skip): any{
    let response = this.http.get(`http://apigroupchat.abhishekpalwankar.xyz/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authToken')}`);
    return response;
  };

  public getGroupChat(groupName,skip): any{
    let response = this.http.get(`http://apigroupchat.abhishekpalwankar.xyz/api/v1/chat/get/for/group?chatRoom=${groupName}&skip=${skip}&authToken=${Cookie.get('authToken')}`);
    return response;
  };

  public authError = () =>{
    let listen = Observable.create((observer) =>{
      this.socket.on('auth-error',(err) =>{
        console.log("Received err from auth-error");
        observer.next(err);
      });
    });
    return listen;
  };

  public exitSocket(): any{
    // disconnect event which is on server is emitted by the browser on closing the tab by default
    this.socket.disconnect();
    
  }

  public createGroupFunction = (groupName) =>{
    this.socket.emit('create-group',groupName);
  };

  public deleteGroupFunction = (data) =>{
    this.socket.emit('delete-group',data);
  };

  public joinGroupFunction = (groupName) =>{
    this.socket.emit('join-group',groupName);
  };

  public getOnlineGroupList = () =>{
    let listen = Observable.create((observer) =>{
      this.socket.on('online-group-list',(groupList) =>{
        console.log("Received groupList from online-group-list event");
        observer.next(groupList);
      });
    });
    return listen;
  };

  // we are creating this event to delete the user from online user,because above functions only calls up on closing the window
  public logout = () =>{
    this.socket.emit('logout','');
  };


  //general exception handler for http request
  private handleError(err:HttpErrorResponse){
    console.log("Handle error http calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }

};
