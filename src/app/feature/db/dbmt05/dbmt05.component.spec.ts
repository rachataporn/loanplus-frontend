import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dbmt05Component } from './dbmt05.component';

describe('Dbmt05Component', () => {
  let component: Dbmt05Component;
  let fixture: ComponentFixture<Dbmt05Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dbmt05Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dbmt05Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
