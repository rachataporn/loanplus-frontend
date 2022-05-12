import { Component, ElementRef, OnInit  } from '@angular/core';
import { Replace } from '../../replace';

@Component({
  selector: 'app-sidebar-minimizer',
  template: `
    <button class="sidebar-minimizer" type="button" appSidebarMinimizer appBrandMinimizer></button>
  `
})
export class AppSidebarMinimizerComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    Replace(this.el);
  }
}
