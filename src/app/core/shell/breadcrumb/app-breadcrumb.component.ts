import { Component, ElementRef, Input, OnInit  } from '@angular/core';
import { Replace } from '../replace';
import { AppBreadcrumbService } from './app-breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  template: `
    <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs | async" let-last = last>
      <li class="breadcrumb-item" *ngIf="breadcrumb.label.title" [class.active]="last" [class.text-danger]="!last">
        <span>{{breadcrumb.label.title | translate}}</span>
      </li>
    </ng-template>
  `
})
export class AppBreadcrumbComponent implements OnInit {
  @Input() fixed: boolean;
  public breadcrumbs;

  constructor(public service: AppBreadcrumbService, public el: ElementRef) { }

  public ngOnInit(): void {
    Replace(this.el);
    this.isFixed(this.fixed);
    this.breadcrumbs = this.service.breadcrumbs;
  }

  isFixed(fixed: boolean): void {
    if (this.fixed) { document.querySelector('body').classList.add('breadcrumb-fixed'); }
  }
}