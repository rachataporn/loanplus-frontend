import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertService } from '../alert.service';
import { BypassGuardService } from '../bypass-guard.service';
import { LoadingService } from '../loading.service';
/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {

    const as = this.injector.get(AlertService);
    const route = this.injector.get(Router);
    const bypass = this.injector.get(BypassGuardService);
    const loading = this.injector.get(LoadingService);
    loading.forceHide();
    // loading.hide();
    if (response instanceof HttpErrorResponse) {
      let title = "Message.SU00037";
      let httpErrorCode = response.status;
      if (!navigator.onLine) {
        // Handle offline error
        as.warning("Message.SU00038", title);
        return of(response);
      }
      switch (httpErrorCode) {
        case 0://API UNAVAILABLE
          as.error("Message.SU00039", title);
          break;
        case 403://FORBIDDEN
          bypass.bypass();
          route.navigate(['/dashboard']).then(() => {
            as.error("Message.SU00040", title);
          });
          break;
        case 401://UNAUTHORIZED
          bypass.bypass();
          route.navigate(['/login']).then(() => {
            as.error("Message.SU00041", title);
          });
          break;
        case 400://BADREQUEST
          let modelBadRequest = response.error.errors;
          as.apiError(modelBadRequest);
          break;
        case 404://NOTFOUND
          let model = response.error.errors;
          as.apiError(model);
          break;
        case 413://SERVER
          as.error("Message.SU00042", title);
          break;
        case 500://SERVER
          as.error("Message.SU00039", title);
          break;
        default:
          as.error(response.message, title);
          break;
      }
    }
    // Do something with the error
    return of(response);
  }

}
