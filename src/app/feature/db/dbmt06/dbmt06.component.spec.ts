import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dbmt06Component } from './dbmt06.component';

describe('Dbmt05Component', () => {
  let component: Dbmt06Component;
  let fixture: ComponentFixture<Dbmt06Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dbmt06Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dbmt06Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
