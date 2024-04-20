import { Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForecastGuard implements CanActivate {
  constructor(
    private router:Router,
    ){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(sessionStorage.getItem('username')=='null'){
        this.router.navigate(['login'])
        return false;
      }
      else{
        if(sessionStorage.getItem('allowForecast')=='no'){  
          this.router.navigate(['home'])
          return false;
        }
        else return true;
      }

      
  }
  
}
