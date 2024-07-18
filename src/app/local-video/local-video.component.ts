// src/app/components/local-video/local-video.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { JitsiService } from '../jitsi.service';

@Component({
  selector: 'app-local-video',
  templateUrl: './local-video.component.html',
  styleUrls: ['./local-video.component.scss'],
})
export class LocalVideoComponent implements OnInit, OnDestroy {
  localVideoTrack: any;
  localAudioTrack: any;
  isMuted = false;

  constructor(private jitsiService: JitsiService) {}

  ngOnInit(): void {
    this.jitsiService.localVideoTrack.subscribe((track) => {
      this.localVideoTrack = track;
      if (track) {
        track.attach(document.getElementById('localVideo'));
      }
    });

    this.jitsiService.localAudioTrack.subscribe((audioTrack) => {
      this.localAudioTrack = audioTrack;
    });
  }

  endConf() {
    if (this.localVideoTrack) {
      this.localVideoTrack.dispose();
      this.localVideoTrack.detach(document.getElementById('localVideo'));
    }
    this.jitsiService.leaveConference();
  }

  closeVideo() {
    this.localVideoTrack.mute();
  }

  resumeVideo() {
    this.localVideoTrack.unmute();
  }

  mute() {
    this.localAudioTrack.mute();
    this.isMuted = true;
  }

  unmute() {
    this.localAudioTrack.unmute();
    this.isMuted = false;
  }

  ngOnDestroy(): void {
    if (this.localVideoTrack) {
      this.localVideoTrack.detach(document.getElementById('localVideo'));
    }
  }
}
