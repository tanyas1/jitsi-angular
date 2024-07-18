import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteVideosComponent } from './remote-video.component';

describe('RemoteVideoComponent', () => {
  let component: RemoteVideosComponent;
  let fixture: ComponentFixture<RemoteVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoteVideosComponent]
    });
    fixture = TestBed.createComponent(RemoteVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
