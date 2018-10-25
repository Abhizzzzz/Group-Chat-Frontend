import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from './chatbox/chatbox.component';
import{RouterModule,Router} from '@angular/router';
import { SocketService } from '../socket.service';
import { ChatRouteGaurdService } from './chat-route-gaurd.service';
import { SharedModule } from '../shared/shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'chatroom',component: ChatboxComponent,canActivate: [ChatRouteGaurdService]}
    ])
  ],
  declarations: [ChatboxComponent],
  providers: [SocketService,ChatRouteGaurdService]
})
export class ChatModule { }
