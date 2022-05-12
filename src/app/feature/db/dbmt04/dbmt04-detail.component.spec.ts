import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dbmt04DetailComponent } from './dbmt04-detail.component';

describe('Dbmt04DetailComponent', () => {
  let component: Dbmt04DetailComponent;
  let fixture: ComponentFixture<Dbmt04DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dbmt04DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dbmt04DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
