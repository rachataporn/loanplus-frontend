import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any) {
    const header = "Application error.";
    const ts = this.injector.get(ToastrService);
    ts.error(error.message, header);
    console.error(error);
  }
}