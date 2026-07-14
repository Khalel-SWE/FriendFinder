import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendSuggestions } from './friend-suggestions';

describe('FriendSuggestions', () => {
  let component: FriendSuggestions;
  let fixture: ComponentFixture<FriendSuggestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendSuggestions],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendSuggestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
