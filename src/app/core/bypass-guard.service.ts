import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BypassGuardService {

    private canGo: boolean = false;

    constructor() { }

    bypass() {
        this.canGo = true;
    }

    canNavigate() {
        let current = this.canGo;
        this.canGo = false;
        return current;
    }
}