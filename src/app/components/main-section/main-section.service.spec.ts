import { TestBed } from '@angular/core/testing';

import { MainSectionService } from './main-section.service';

describe('MainSectionService', () => {
  let service: MainSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
