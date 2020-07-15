import { TestBed } from '@angular/core/testing';

import { CanEnterLoginPageGuard } from './can-enter-login-page.guard';

describe('CanEnterLoginPageGuard', () => {
  let guard: CanEnterLoginPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanEnterLoginPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
