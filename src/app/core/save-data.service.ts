import { Injectable } from '@angular/core';

interface Saver {
    data: any,
    type: string
}
@Injectable({
    providedIn: 'root',
})
export class SaveDataService {
    private dateRegex = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;
    constructor() { }
    private convertDates(object: Object) {
        if (!object || !(object instanceof Object)) {
            return;
        }

        if (object instanceof Array) {
            for (const item of object) {
                this.convertDates(item);
            }
        }

        for (const key of Object.keys(object)) {
            const value = object[key];

            if (value instanceof Array) {
                for (const item of value) {
                    this.convertDates(item);
                }
            }

            if (value instanceof Object) {
                this.convertDates(value);
            }

            if (typeof value === 'string' && this.dateRegex.test(value)) {
                object[key] = new Date(value);
            }
        }
    }

    delete(key: string) {
        sessionStorage.removeItem(key);
    }

    save(data: any, key: string) {
        let type: any = typeof (data);
        let dataString;
        if (type !== "object") {
            dataString = String(data);
        }
        else if (data instanceof Date) {
            dataString = data ? data.getTime() : null;
            type = "date";
        }
        else {
            dataString = JSON.stringify(data);
        }
        const saveData = {
            data: dataString,
            type: type
        }

        sessionStorage.setItem(key, JSON.stringify(saveData));
    }

    retrive(key: string) {
        const dataStore = sessionStorage.getItem(key);
        if (dataStore) {
            const saveData: Saver = JSON.parse(dataStore);
            switch (saveData.type) {
                case 'string':
                    return saveData.data;
                case 'number':
                    return Number(saveData.data);
                case 'boolean':
                    return saveData.data as boolean;
                case 'date':
                    return saveData.data ? new Date(saveData.data) : null;
                case 'object':
                    let obj = JSON.parse(saveData.data);
                    this.convertDates(obj);
                    return obj;
                default:
                    return null;
            }
        }
        else return null;
    }
}