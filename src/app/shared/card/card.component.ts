import { Component, Input } from '@angular/core';
import { timer } from 'rxjs';
import { DomService } from '../service/dom.service';

@Component({
  selector: 'card',
  templateUrl: 'card.component.html',
})
export class CardComponent {
  @Input() header: string = '';
  @Input() isCollapsed: boolean = false;

  constructor(private dom:DomService){

  }

  expanded() {
    this.dom.triggerResize();
  }
}