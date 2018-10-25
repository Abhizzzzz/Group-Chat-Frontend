import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { SocketService } from '../../socket.service';
import { AppService } from '../../app.service';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {ActivatedRoute,Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  @ViewChild('scrollMe',{read:ElementRef})
  // declare a variable scrollMe of ElementRef
  public scrollMe: ElementRef;
  authToken: any;
  userInfo: any;
  userList: any = [];
  receiverId: any;
  receiverName: any;
  messageText: any;
  messageList: any = [];
  scrollToChatTop: boolean = false;
  loadingPreviousChat: boolean = false;
  pageValue: any;
  groupName: any;
  groupForHtmlArrangement: any;
  groupList: any = [];

  constructor(public socketService: SocketService,public appService: AppService,public router: Router,private toastr: ToastrService) { 
    console.log("ChatRoom")
  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    console.log(this.userInfo);
    this.socketService.verifyUSer().subscribe((data) =>{
    this.socketService.setUser(this.authToken);
    this.socketService.getOnlineUserList().subscribe((data) =>{
      console.log("Some user joined or left");
      this.userList = [];
      for(let x in data){
        let temp = {'userId': x,'name': data[x],'read': 0,'chatting': false};
        this.userList.push(temp);
      };
      
      console.log(this.userList);


    });
    });
    this.socketService.getOnlineGroupList().subscribe((data) =>{
      this.groupList = [];
      for(let x in data){
        let temp = {'groupId': x,'groupName': data[x],'read': 0,'chatting': false};
        this.groupList.push(temp);
      }
      console.log(this.groupList);
    });
    this.socketService.authError().subscribe((err) =>{
      console.log(err)
      if(err.error === 'Token expired'){
        console.log("Expired token!!");
        this.router.navigate(['/']);
      }
    });

    this.getAMessage();
    this.socketService.getGroupMessageFunction().subscribe((data) =>{
      (this.receiverId === data.receiverId)?this.messageList.push(data): '';
      this.toastr.success(`${data.senderName} says ${data.message} in ${data.chatRoom} group`);
      this.scrollToChatTop = false;
    });

    this.socketService.typingListeningEvent().subscribe((data) =>{
        console.log(`${data.name} is typing in ${data.chatRoom} group`);
        this.toastr.warning(`${data.name} is typing in ${data.chatRoom} group`);
    });
  };

  public userSelectedToChat = (id,name) =>{
    this.groupForHtmlArrangement = false;

    this.userList.map(user =>{
      if(user.userId == id){
        user.chatting = true;
        user.read = 1;
      }
      else{
        user.chatting = false;
      }

      Cookie.set('receiverId',id);
      Cookie.set('receiverName',name);
      this.receiverId = id;
      this.receiverName = name;
      this.messageList = [];
      this.pageValue = 0;
      this.getPreviousChat();
      

    });



  }; // end of userSelectedToChat

  public groupSelectedToDelete = (groupId,groupName) =>{
    this.socketService.deleteGroupFunction(groupId);
  } // end of groupSelectedToDelete


  groupSelectedToChat = (id,name) =>{
    this.receiverName = false;
    this.groupList.map(group =>{
      if(group.groupId === id){
        group.chatting = true;
        group.read = 1;
      }
      else{
        group.chatting = false;
      }

      Cookie.set('receiverId',id);
      Cookie.set('receiverName',name);
      this.receiverId = id;
      this.groupForHtmlArrangement = name;
      this.messageList = [];
      this.pageValue = 0;
      this.socketService.joinGroupFunction(name);
      this.getPreviousGroupChat(name);
      

    });

  }; // end of groupSelectedToChat

  getPreviousChat = () =>{
    let previousData = (this.messageList.length > 0? this.messageList.slice():[]);
    this.socketService.getChat(this.userInfo.userId,this.receiverId,this.pageValue*10).subscribe((data) =>{
      if(data.status === 200){
        this.messageList = data.data.concat(previousData);
        console.log(this.messageList);
      }
      else{
        this.messageList = previousData;
        this.toastr.warning('No messages available');
      }
    });
  }

  getPreviousGroupChat = (groupName) =>{
    let previousData = (this.messageList.length > 0? this.messageList.slice():[]);
    this.socketService.getGroupChat(groupName,this.pageValue*10).subscribe((data) =>{
      if(data.status === 200){
        this.messageList = data.data.concat(previousData);
        console.log(this.messageList);
      }
      else{
        this.messageList = previousData;
        this.toastr.warning('No messages available');
      }
    });
  }

  // for handling the event from child component
  showUserName = (name: string) =>{
    this.toastr.success("You are chatting with "+name);
  }

  sendUserMessageUsingKeyPress: any = (event: any) =>{
    if(event.keyCode === 13){
      this.sendMessage();
    }
  }

  sendGroupMessageUsingKeyPress: any = (event: any) =>{
    if(event.keyCode === 13){
      this.sendGroupMessage();
    }

    let typerDetails = {
      name: this.userInfo.firstName+' '+this.userInfo.lastName,
      chatRoom: this.groupForHtmlArrangement
    };

    this.socketService.typingEmittingEvent(typerDetails);

  }

  public sendMessage = () =>{
    let data = {
      senderId: this.userInfo.userId,
      senderName: this.userInfo.firstName+" "+this.userInfo.lastName,
      receiverId: Cookie.get('receiverId'),
      receiverName: Cookie.get('receiverName'),
      message: this.messageText,
      createdOn: new Date()
    };
    this.socketService.sendMessageFunction(data);
    this.messageText = '';
    this.messageList.push(data);
    this.scrollToChatTop = false;
  }; // end of sendMessage

  sendGroupMessage = () =>{
    
    let data = {
      senderId: this.userInfo.userId,
      senderName: this.userInfo.firstName+" "+this.userInfo.lastName,
      receiverId: Cookie.get('receiverId'),
      receiverName: Cookie.get('receiverName'),
      chatRoom: this.groupForHtmlArrangement,
      message: this.messageText,
      createdOn: new Date()
    };
    this.socketService.sendMessageFunction(data);
    this.messageText = '';
    this.messageList.push(data);
    this.scrollToChatTop = false;
  }; // end of sendGroupMessage

  public getAMessage = () =>{
    this.socketService.getAMessageFunction(this.userInfo.userId).subscribe((apiResponse) =>{
      console.log(apiResponse);
      (this.receiverId === apiResponse.senderId)?this.messageList.push(apiResponse): '';
      this.toastr.success(`${apiResponse.senderName} says ${apiResponse.message}`);
      this.scrollToChatTop = false;
    });
  }; // end of getAMessage

  loadEarlierPageOfChat = () =>{
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChat();
    this.loadingPreviousChat = true;
  }

  loadEarlierPageOfGroupChat = () =>{
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousGroupChat(this.groupForHtmlArrangement);
    this.loadingPreviousChat = true;
  }

  public createGroup = () =>{
    console.log(this.groupName);
    this.socketService.createGroupFunction(this.groupName);
    this.groupName = '';

  }; // end of createGroup

  public logout = () =>{

    this.appService.logoutFunction(this.userInfo.userId,this.authToken).subscribe((apiResponse) =>{
      if(apiResponse.status === 200){
        this.socketService.logout();
        Cookie.delete('authToken');
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        // while logout we need to clear localstorage
        localStorage.clear();
        this.toastr.success('Logged out successfully!!');
        this.socketService.exitSocket();
        this.router.navigate(['/']);
      }
      else if(apiResponse.message === 'User logged out already or user not registered'){
        console.log(apiResponse.message);
        this.socketService.exitSocket();
        this.toastr.error(apiResponse.message);
        this.router.navigate(['/']);
      }
      else{
        this.toastr.error('Some error occured');
      }
    });

  };

}
