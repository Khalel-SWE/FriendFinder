import { TestBed } from '@angular/core/testing';

import { ActivityModel } from './activity-model';

describe('ActivityModel', () => {
  let service: ActivityModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
