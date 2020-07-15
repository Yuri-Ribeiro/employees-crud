import { TestBed } from '@angular/core/testing';

import { CanEnterHomePageGuard } from './can-enter-home-page.guard';

describe('CanEnterHomePageGuard', () => {
  let guard: CanEnterHomePageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanEnterHomePageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
