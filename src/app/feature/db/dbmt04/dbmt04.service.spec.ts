import { TestBed } from '@angular/core/testing';

import { Dbmt04Service } from './dbmt04.service';

describe('Dbmt04Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Dbmt04Service = TestBed.get(Dbmt04Service);
    expect(service).toBeTruthy();
  });
});
