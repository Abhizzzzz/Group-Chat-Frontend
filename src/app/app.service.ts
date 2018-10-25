import { Injectable } from '@angular/core';
//Importing HttpClient and HttpErrorResponse
import {HttpClient,HttpErrorResponse, HttpParams} from '@angular/common/http';

//Importing observables related code
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
//for cookies
import {Cookie} from 'ng2-cookies/ng2-cookies'; 



@Injectable({
  providedIn: 'root'
})
export class AppService {

  private baseUrl = 'http://apigroupchat.abhishekpalwankar.xyz/api/v1/users';

  constructor(public http: HttpClient) { 
    console.log("AppService Called!!");
  }

  public signInFunction(data): any{
    const params = new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('password',data.password)
    .set('email',data.email)
    .set('mobileNumber',data.mobileNumber)

    let response = this.http.post(`${this.baseUrl}/signup`,params);
    return response;
  };

  public loginFunction(data): any{
    const params = new HttpParams()
    .set('password',data.password)
    .set('email',data.email)

    let response = this.http.post(`${this.baseUrl}/login`,params);
    return response;
  };

  // for HTML5 local storage
  public setUserInfoInLocalStorage = (data) =>{
    // converting the JSON into string and storing
    localStorage.setItem('userInfo',JSON.stringify(data));
  }

  public getUserInfoFromLocalStorage = () =>{
    // getting back the string in the JSON format
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  

  // logout
  public logoutFunction(userId,authToken): any{
    const params = new HttpParams().set('authToken',authToken);
    let response = this.http.post(`${this.baseUrl}/logout/${userId}`,params);
    return response;
  };


  //general exception handler for http request
  private handleError(err:HttpErrorResponse){
    console.log("Handle error http calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }

  


};
