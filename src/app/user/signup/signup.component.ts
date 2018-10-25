import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  firstName: any;
  lastName: any;
  password: any;
  email: any;
  mobileNumber: any;

  constructor(public router: Router,public service: AppService,private toastr: ToastrService) { 
    console.log("Signup Called!!");
  }

  ngOnInit() {
  }

  goToLogin() {
    this.router.navigate(['/']);
  };

  signUp() {
    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email,
      mobileNumber: this.mobileNumber
    };

    console.log(data);

    this.service.signInFunction(data).subscribe((apiResponse) =>{

      console.log(apiResponse);
      if(apiResponse.status === 200){
        this.toastr.success('Signup successful!!');
        setTimeout(() =>{
          this.goToLogin();
        },2000);
      }
      else{
        this.toastr.error(apiResponse.message);
      }
    });

  } // end of signUp

}
