import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BypassGuardService } from './bypass-guard.service';
export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    constructor(private bypass: BypassGuardService, private router: Router) { }
    canDeactivate(component: CanComponentDeactivate) {
        if (this.bypass.canNavigate()) {
            return true;
        }
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}