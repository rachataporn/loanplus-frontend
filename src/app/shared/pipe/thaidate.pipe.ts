import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Pipe({
    name: 'thaidate'
})
export class ThaiDatePipe implements PipeTransform {
    transform(date: string,format: string): string {
        if (!date) return null;
        let inputDate = new Date(date);
        let dataDate = [
            inputDate.getDay(), inputDate.getDate(), inputDate.getMonth(), inputDate.getFullYear()
            ,inputDate.getHours(),inputDate.getMinutes(),inputDate.getSeconds()
        ];
        let outputDate = [
            dataDate[1].toString().padStart(2, "00"),
            (dataDate[2] + 1).toString().padStart(2, "00"),
            dataDate[3] + 543
        ];
        let outputTime = [
            dataDate[4].toString().padStart(2, "00"),
            dataDate[5].toString().padStart(2, "00"),
            dataDate[6].toString().padStart(2, "00"),
        ]
        let returnDate: string;
        if(format){
            if(format == "datetime"){
                returnDate = outputDate.join('-') + " " + outputTime.join(':');
            }
            else 
                returnDate = outputDate.join(format);
        }
        else returnDate = outputDate.join('-');
        return returnDate;
    }
}