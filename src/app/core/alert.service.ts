import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

export interface ErrorModel {
    Code: string,
    Parameters: string[]
}

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    configs = { timeOut: 10000 }

    constructor(private trans: TranslateService, private ts: ToastrService) { }

    private arryToObj(params?: any[]): object {
        return (params || []).reduce((result, item, index, array) => {
            const transParam = item ? this.trans.instant(item) : "";
            result[index] = transParam;
            return result;
        }, {});
    }
    success(message?: string, title?: string, params?: any[], config?: any) {
        this.trans.get([title, message], this.arryToObj(params))
            .subscribe((res: any) => {
                this.ts.success(res[message], res[title], this.configs || {});
            })
    }

    error(message?: string, title?: string, params?: any[], config?: any) {
        this.trans.get([title, message], this.arryToObj(params))
            .subscribe((res: any) => {
                this.ts.error(res[message], res[title], this.configs || {});
            })
    }

    apiError(errors: ErrorModel | ErrorModel[] | string) {
        if (typeof errors === "string") {
            this.trans.get([errors])
                .subscribe((res: any) => {
                    this.ts.error(res[errors], null, this.configs);
                })
        }
        else if (errors instanceof Array) {
            const observeTrans = errors.map(function (message) {
                const haveParam = message.Parameters && message.Parameters.length;
                const params = message.Parameters;
                if (haveParam) {
                    return this.trans.get(message.Code, this.arryToObj(params));
                }
                else {
                    return this.trans.get(message.Code);
                }
            }, this);

            forkJoin(
                observeTrans
            ).subscribe(res => {
                const obj = Object.values(res).join("<br>");
                this.ts.error(obj);
            })
        }
        else if (errors.Code) {
            const haveParam = errors.Parameters && errors.Parameters.length;
            const params = errors.Parameters;
            let observeTrans;
            if (haveParam) {
                observeTrans = this.trans.get(errors.Code, this.arryToObj(params));
            }
            else {
                observeTrans = this.trans.get(errors.Code);
            }

            observeTrans.subscribe(res => {
                this.ts.error(res);
            })
        }
        else {
            this.ts.error(JSON.stringify(errors));
        }
    }

    info(message?: string, title?: string, params?: any[], config?: any) {
        this.trans.get([title, message], this.arryToObj(params))
            .subscribe((res: any) => {
                this.ts.info(res[message], res[title], this.configs || {});
            })
    }

    warning(message?: string, title?: string, params?: any[], config?: any) {
        this.trans.get([title, message], this.arryToObj(params))
            .subscribe((res: any) => {
                this.ts.warning(res[message], res[title], this.configs || {});
            })
    }
}