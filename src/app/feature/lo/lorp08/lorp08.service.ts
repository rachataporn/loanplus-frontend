 import { Injectable } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { Observable } from 'rxjs';

 export interface ReportParam {
  FromBranches: string, 
  ToBranch: string,     
  FromContractType: string,  
  ToContractType: string,  
  FromTheBorrowerCode: string,  
  ToTheBorrowerCode: string,     
  FromTheContractDate: Date,  
  UpToTheContractDate: Date,
  
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  FromBranchText: string,
  ToBranchText: string,
  
  ReportName: string,  
  ExportType: string,
 }

 @Injectable()
 export class Lorp08Service {
   constructor(private http: HttpClient) { }

   getMaster(): Observable<any> {
    return this.http.get<any>('loan/writeoff/master/true');
   }
   generateReport(param: ReportParam) {
    return this.http.post('loan/writeoff/getlorp08report', param, { responseType: 'text' });
 }
}