import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate,  RouterStateSnapshot } from '@angular/router';

export interface canLeaveRoute {
  canILeave(): boolean | Promise<boolean>;
}

@Injectable()
export class CanLeaveService implements CanDeactivate<canLeaveRoute{
  canDeactivate(comp: canLeaveRoute, currRoute: ActivatedRouteSnapshot,currState: RouterStateSnapshot,nextState: RouterStateSnapshot) {
    return comp.canILeave();
  }
}
