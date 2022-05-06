import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable()
export class AuthService {
  private token = '';
  constructor(private http: HttpClient, private router: Router) {}

  async login(user, pass): Promise<boolean> {
    //call backend
    try {
      const res = await this.http
        .post<any>(
          'http://192.168.1.32:3000/login',
          {
            username: user,
            password: pass,
          },
          { observe: 'response' }
        )
        .toPromise();
      if (res.status == 200) {
        this.token = res.body.token;
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  isLogin() {
    return this.token != '';
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLogin()) {
      return true;
    }
    return this.router.navigate(['/login']);
  }
}
