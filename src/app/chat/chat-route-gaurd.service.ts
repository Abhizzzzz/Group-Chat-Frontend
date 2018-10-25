import { Injectable } from '@angular/core';
import {ActivatedRoute,Router,CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { Cookie } from '../../../node_modules/ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class ChatRouteGaurdService implements CanActivate {

  constructor(private router: Router) {
    console.log("In chat-route-gaurd");
   }

   canActivate(route:ActivatedRouteSnapshot): boolean{
    console.log("In chat-route-gaurd");
    if(Cookie.get('authToken') === null || Cookie.get('authToken') === undefined || Cookie.get('authToken') === ''){
      this.router.navigate(['/']);
      return false;
    }
    else{
      return true;
    }
   }

}
