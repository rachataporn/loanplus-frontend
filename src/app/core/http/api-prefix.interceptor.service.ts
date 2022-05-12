import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { LoadingService } from '../loading.service';
import { finalize } from 'rxjs/operators';

/**
 * Prefixes all requests with `environment.apiUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  constructor(public ls: LoadingService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.ls.show();
    request = request.clone({ url: environment.apiUrl + request.url });
    return next.handle(request).pipe(
      finalize(() => this.ls.hide())
    );
  }

}
