import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class SidenavService {
 
  constructor(private http: HttpClient) { }
  navSubject = new BehaviorSubject<boolean>(false);
  navs:any[] = [];
  getMenu(): Observable<any[]> {
   return  this.http.get<any>('system/menudisplay/PICO').pipe(
      tap((item)=>{
         this.navs = item;
         this.navSubject.next(true);
      })
    );
  }

}