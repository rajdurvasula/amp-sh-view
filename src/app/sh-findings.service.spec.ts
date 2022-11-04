import { TestBed } from '@angular/core/testing';

import { ShFindingsService } from './sh-findings.service';

describe('ShFindingsService', () => {
  let service: ShFindingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShFindingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
