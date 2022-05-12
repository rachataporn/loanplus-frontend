import { Component, Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Replace } from '../../replace';
import { heightAnimation } from '../../../animation/height.animations';
@Directive({
  selector: '[appNavDropdown]'
})
export class NavDropdownDirective {

  constructor(private el: ElementRef) { }

  toggle() {
    this.el.nativeElement.classList.toggle('open');
  }
  isOpen():boolean{
    return this.el.nativeElement.classList.contains('open');
  }
}


/**
* Allows the dropdown to be toggled via click.
*/
@Directive({
  selector: '[appNavDropdownToggle]'
})
export class NavDropdownToggleDirective {
  constructor(private dropdown: NavDropdownDirective) { }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    this.dropdown.toggle();
  }
}

@Component({
  selector: 'app-sidebar-nav',
  template: `
    <ul class="nav animated fadeIn" *ngIf="navItems.length > 0">
      <ng-template ngFor let-navitem [ngForOf]="getParent()">
        <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
        <ng-template [ngIf]="isTitle(navitem)">
          <app-sidebar-nav-title [title]='navitem'></app-sidebar-nav-title>
        </ng-template>
        <ng-template [ngIf]="!isDivider(navitem)&&!isTitle(navitem)">
          <app-sidebar-nav-item [item]='navitem' [allItems]='navItems' [level]='1'></app-sidebar-nav-item>
        </ng-template>
      </ng-template>
    </ul>`
})
export class AppSidebarNavComponent {
  @Input() navItems: any[];
  parentItems : any[];
  @HostBinding('class.sidebar-nav') true;
  @HostBinding('attr.role') role = 'nav';

  public isDivider(item) {
    return item.divider ? true : false;
  }

  public isTitle(item) {
    return item.title ? true : false;
  }

  public getParent():any[]{
    return this.navItems.filter(function(item){
      return item.parent === null;
    });
  }
  constructor(private el: ElementRef) { }

  ngOnInit() {
  
  }
}

import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
      <app-sidebar-nav-link [link]='item' [level]='level'></app-sidebar-nav-link>
    </li>
    <ng-template #dropdown>
      <li [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown' "
          [class.open]="isActive()"
          routerLinkActive="open"
          appNavDropdown>
        <app-sidebar-nav-dropdown [link]='item' [allItems]='allItems' [level]='level' ></app-sidebar-nav-dropdown>
      </li>
    </ng-template>
    `
})
export class AppSidebarNavItemComponent implements OnInit {
  @Input() level:number;
  @Input() item: any;
  @Input() allItems:any[];
  public hasClass() {
    return this.item.class ? true : false;
  }

  public isDropdown() {
   // return this.item.children ? true : false;
   let children = this.allItems.filter(function(item){
      return item.parent === this.item.id;
   },this);
   return children.length > 0 ? true : false;
  }

  public thisUrl() {
    return this.item.url;
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), true);
  }

  constructor(private router: Router, private el: ElementRef) { }

  ngOnInit() {
    Replace(this.el);
  }

}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a *ngIf="!isExternalLink(); else external"
      [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
      [style.padding-left.px]="paddingStyle"
      routerLinkActive="active"
      [routerLink]="[link.url]"
      (click)="hideMobile()">
      <i *ngIf="isIcon()" class="nav-icon {{ link.icon }}"></i>
      {{ link.name | translate }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" href="{{link.url}}">
        <i *ngIf="isIcon()" class="nav-icon {{ link.icon }}"></i>
        {{ link.name }}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent implements OnInit {
  @Input() level:number;
  @Input() link: any;

  public hasVariant() {
    return this.link.variant ? true : false;
  }

  public isBadge() {
    return this.link.badge ? true : false;
  }

  public isExternalLink() {
    return this.link.url.substring(0, 4) === 'http' ? true : false;
  }

  public isIcon() {
    return this.link.icon ? true : false;
  }

  public hideMobile() {
    if (document.body.classList.contains('sidebar-show')) {
      document.body.classList.toggle('sidebar-show');
    }
  }

  get paddingStyle() {
    return  this.level*10;
  }
  constructor(private router: Router, private el: ElementRef) { }

  ngOnInit() {
    Replace(this.el);
  }
}

@Component({
  selector: 'app-sidebar-nav-dropdown',
  animations: [ heightAnimation ],
  template: `
    <a class="nav-link nav-dropdown-toggle" 
     [style.padding-left.px]="paddingStyle"
    appNavDropdownToggle>
      <i *ngIf="isIcon()" class="nav-icon {{ link.icon }}"></i>
      {{ link.name | translate}}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ul class="nav-dropdown-items" [@heightAnimation]="getState()" >
      <ng-template ngFor let-child [ngForOf]="getChild()">
        <app-sidebar-nav-item [item]='child' [allItems]='allItems' [level]='level+1'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `,
  styles: [`.nav-dropdown-toggle { cursor: pointer; }`]
})
export class AppSidebarNavDropdownComponent implements OnInit {
  @Input() level:number;
  @Input() link: any;
  @Input() allItems:any[];

  public isBadge() {
    return this.link.badge ? true : false;
  }

  public isIcon() {
    return this.link.icon ? true : false;
  }

  public getChild(): any[]{
      return this.allItems.filter(function(item){
         return item.parent === this.link.id;
      },this);
  }

  public getState(){
    if(this.dropdown.isOpen()){
       return "open";
    }
    else return "close";
  }
  get paddingStyle() {
    return  this.level*10;
  }
  constructor(private router: Router, private el: ElementRef,private dropdown: NavDropdownDirective) { }

  ngOnInit() {
    Replace(this.el);
  }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const li = this.renderer.createElement('li');
    const name = this.renderer.createText(this.title.name);

    this.renderer.addClass(li, 'nav-title');

    if (this.title.class) {
      const classes = this.title.class;
      this.renderer.addClass(li, classes);
    }

    if (this.title.wrapper) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element);

      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(li, wrapper);
    } else {
      this.renderer.appendChild(li, name);
    }
    this.renderer.appendChild(nativeElement, li);
    Replace(this.el);
  }
}
