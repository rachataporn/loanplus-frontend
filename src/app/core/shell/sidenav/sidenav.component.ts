import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { SidenavService } from './sidenav.service';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-nav',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  menuItems = [];
  configScroll: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    maxScrollbarLength: 150,
    wheelPropagation: false
  };
  constructor(private sidenavService: SidenavService) {
  }
  ngOnInit() {
    this.getMenu().pipe(
      map(items => {
        if (environment.production) {
          return items;
        }
        else {
          items.unshift({ id: 'Demo', name: 'Demo', url: '/demo/program', parent: null, icon: 'fas fa-vial' });
          return items;
        }
      })
    ).subscribe(items => this.menuItems = items);
  }

  getMenu() {
    return this.sidenavService.getMenu();
  }
}