import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import {Cookie} from 'ng2-cookies/ng2-cookies'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: any;
  password: any;

  constructor(public router: Router,public service: AppService,private toastr: ToastrService) { 
    console.log("Login Called!!");
  }

  ngOnInit() {
  }

  goToSignUp(){
    this.router.navigate(['/signup']);
  };

  login(): any{
    let data = {
      email: this.email,
      password: this.password
    };

    this.service.loginFunction(data).subscribe((apiResponse) =>{

      if(apiResponse.status === 200){
        console.log(apiResponse);
        this.toastr.success('Logged in successfully!!');
        Cookie.set('authToken',apiResponse.data.authToken);
        Cookie.set('receiverId',apiResponse.data.userDetails.userId);
        Cookie.set('receiverName',apiResponse.data.userDetails.firstName+' '+apiResponse.data.userDetails.lastName);
        this.service.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          this.router.navigate(['/chatroom']);
      }
      else{
        this.toastr.error(apiResponse.message);
      }

    });

  };

}
