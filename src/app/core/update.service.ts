import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr';
import { first, tap } from 'rxjs/operators';
import { interval, concat, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UpdateConfirmComponent } from '@app/shared/modal/update-confirm.component';


export enum Size {
    small = "modal-sm",
    medium = "",
    large = "modal-lg"
}
@Injectable({ providedIn: 'root' })
export class UpdateService {
    private currentHash = environment.version;
    constructor(private http: HttpClient, private appRef: ApplicationRef, private swUpdate: SwUpdate, private toast: ToastrService,
        private bsModalService: BsModalService,

    ) {

    }
    public init() {
        const appIsStable = this.appRef.isStable.pipe(
            first(isStable => isStable),
            tap(() => console.info("stabled"))
        );
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(event => {
                console.log('current version is', event.current);
                console.log('available version is', event.available);
                this.updateConfirm("กดตกลง เพื่ออัพเดตเวอร์ชั่นโปรแกรม").subscribe(
                    (res) => {
                        if (res) {
                            document.location.reload();
                        }
                    })
            });
            this.swUpdate.activated.subscribe(event => {
                console.log('old version was', event.previous);
                console.log('new version is', event.current);
            });

            const everyDelay = interval(6 * 60 * 60);
            const everyDelayOnceAppIsStable = concat(appIsStable, everyDelay);
            console.info("begin Check..");
            everyDelayOnceAppIsStable.subscribe(() => {
                this.swUpdate.checkForUpdate().then(() => console.info("checking for new version.."))
            });
        }
        else if (environment.production) {
            const everyDelay = interval(6 * 60 * 60);
            const everyDelayOnceAppIsStable = concat(appIsStable, everyDelay);
            console.info("begin Check for unsupport sw..");
            everyDelayOnceAppIsStable.subscribe(() => {
                this.checkVersion(`${environment.clientUrl}/external/version.json`);
            });
        }
    }

    /**
   * Will do the call and check if the hash has changed or not
   * @param url
   */
    private checkVersion(url) {
        // timestamp these requests to invalidate caches
        this.http.skipJwtHandler().disableApiPrefix().get(url + '?t=' + new Date().getTime())
            .pipe(first())
            .subscribe(
                (response: any) => {
                    const hash = response.hash;
                    const hashChanged = this.hasHashChanged(this.currentHash, hash);
                    // If new version, do something
                    if (hashChanged) {
                        this.updateConfirm("กดตกลง เพื่ออัพเดตเวอร์ชั่นโปรแกรม").subscribe(
                            (res) => {
                                if (res) {
                                    document.location.reload();
                                }
                            })
                    }
                    // store the new hash so we wouldn't trigger versionChange again
                    // only necessary in case you did not force refresh
                    this.currentHash = hash;
                },
                (err) => {
                    console.error(err, 'Could not get version');
                }
            );
    }

    updateConfirm(message: string, size?: Size): Observable<boolean> {
        const initialState = {
            message: message
        };
        const modal = this.bsModalService.show(UpdateConfirmComponent, { initialState, ignoreBackdropClick: true, class: Size.large });
        return modal.content.selected;
    }

    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     * @param currentHash
     * @param newHash
     * @returns {boolean}
     */
    private hasHashChanged(currentHash, newHash) {
        if (!currentHash) {
            return false;
        }
        return currentHash !== newHash;
    }
}