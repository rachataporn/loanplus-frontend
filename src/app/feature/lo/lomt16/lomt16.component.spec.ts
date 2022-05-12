import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Lomt16Component } from './lomt16.component';

describe('Lomt16Component', () => {
  let component: Lomt16Component;
  let fixture: ComponentFixture<Trmt03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Lomt16Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Lomt16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
