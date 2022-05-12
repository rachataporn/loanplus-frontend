import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dbmt04Component } from './dbmt04.component';

describe('Dbmt04Component', () => {
  let component: Dbmt04Component;
  let fixture: ComponentFixture<Dbmt04Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dbmt04Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dbmt04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
