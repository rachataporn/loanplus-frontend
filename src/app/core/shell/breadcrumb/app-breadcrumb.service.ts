import { Injectable, Injector } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { filter, switchMap, take } from 'rxjs/operators';

import { SidenavService } from '../sidenav/sidenav.service';
@Injectable()
export class AppBreadcrumbService {

  breadcrumbs: Observable<Array<Object>>;

  private _breadcrumbs: BehaviorSubject<Array<Object>>;

  constructor(private router: Router, private route: ActivatedRoute, private sn: SidenavService) {

    this._breadcrumbs = new BehaviorSubject<Object[]>(new Array<Object>());

    this.breadcrumbs = this._breadcrumbs.asObservable();

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      const breadcrumbs = [];
      let currentRoute = this.route.root;
      let data: any;
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        childrenRoutes.forEach(route => {
          if (route.outlet === 'primary') {
            data = route.snapshot.data;
            currentRoute = route;
          }
        });
      } while (currentRoute);
      let menu;

      this.sn.navSubject.pipe(
        filter(value => value == true),
        take(1)
      ).subscribe(
        () => {
          let current = this.sn.navs.find((menu) => {
            return menu.code == data.code;
          })
          if (current) {
            menu = current;
            do {
              breadcrumbs.unshift({
                label: { title: `Menu.${menu.id}` },
                url: ''
              });
              menu = this.sn.navs.find((item) => {
                return item.id == menu.parent;
              })

            }
            while (menu)
          }
          this._breadcrumbs.next(Object.assign([], breadcrumbs));
        
        }
      )
      return breadcrumbs;
    });
  }
}