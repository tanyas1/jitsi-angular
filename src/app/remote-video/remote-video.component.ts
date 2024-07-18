// src/app/components/remote-videos/remote-videos.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { JitsiService } from '../jitsi.service';

@Component({
  selector: 'app-remote-video',
  templateUrl: './remote-video.component.html',
  styleUrls: ['./remote-video.component.scss'],
})
export class RemoteVideosComponent implements OnInit, OnDestroy {
  remoteVideoTracks: any[] = [];
  remoteAudioTracks: any[] = [];
  videoElementId = 0;
  remoteTracks: any = [];
  audioElementId: any = [];
  constructor(private jitsiService: JitsiService) {}

  ngOnInit(): void {
    this.jitsiService.remoteTrackCalled.subscribe((track) => {
      if (track.isLocal()) {
        return;
      }

      console.warn('----------------TRACK--------------', track);

      // console.warn('------------------display name', track.getDisplayName());
      const participant = track.getParticipantId();

      if (!this.remoteTracks[participant]) {
        this.remoteTracks[participant] = [];
      }
      const idx = this.remoteTracks[participant].push(track);
      if (track.getType() === 'video') {
        this.addVideoElement(track);
      } else {
        this.addAudioElement(track.stream);
      }
    });

    this.jitsiService.remoteVideoTracks.subscribe((tracks) => {
      this.remoteVideoTracks = tracks;
      console.warn('ngoninit remote video track ----->>>', tracks);
      this.updateRemoteVideos();
    });
  }

  addVideoElement(video: any) {
    console.log('--------------videoStream-------------------', video);
    console.log('hello');

    const videoStream = video.stream;
    const videoElement = document.createElement('video');
    videoElement.srcObject = videoStream;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.className = 'video-element';
    videoElement.id = 'video' + this.videoElementId;
    this.videoElementId++;

    const name = document.createElement('div');
    // name.innerHTML = video.getDisplayName();
    document.getElementById('remoteVideoContainer')!.appendChild(videoElement);
  }

  addAudioElement(audioStream: any) {
    const audioElement = document.createElement('audio');
    audioElement.srcObject = audioStream;
    audioElement.autoplay = true;
    audioElement.id = 'audio' + this.audioElementId;
    this.audioElementId++;
    document.body.appendChild(audioElement);
  }

  ngOnDestroy(): void {
    // this.remoteVideoTracks.forEach((track) => {
    //   track.detach(
    //     document.getElementById(`remoteVideo-${track.getParticipantId()}`)
    //   );
    // });
  }

  private updateRemoteVideos() {
    // this.remoteVideoTracks.forEach((track) => {
    //   track.attach(
    //     document.getElementById(`remoteVideo-${track.getParticipantId()}`)
    //   );
    // });
  }

  // private updateRemoteAudio() {
  //   this.remoteAudioTracks.forEach((track) => {
  //     console.log('TRACK ----->>>>>', track);
  //     track.attach(
  //       document.getElementById(`remoteAudio-${track.getParticipantId()}`)
  //     );
  //   });
  // }
}
