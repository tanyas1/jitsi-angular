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

  localVideoTrack: any;
  localAudioTrack: any;
  isMuted = false;
  isVideoOff = false;
  isLocalVideoSet = false;

  constructor(private jitsiService: JitsiService) {}


  endConf() {
    if (this.localVideoTrack) {
      this.localVideoTrack.dispose();
      this.localVideoTrack.detach(document.getElementById('localVideo'));
    }
    this.jitsiService.leaveConference();
    this.isLocalVideoSet = false;
    location.reload();
  }

  closeVideo() {
    this.localVideoTrack.mute();
    this.isVideoOff = true;
  }

  resumeVideo() {
    this.localVideoTrack.unmute();
    this.isVideoOff = false;

  }

  mute() {
    this.localAudioTrack.mute();
    this.isMuted = true;
  }

  unmute() {
    this.localAudioTrack.unmute();
    this.isMuted = false;
  }

 


  ngOnInit(): void {
    this.jitsiService.remoteTrackCalled.subscribe((track) => {
      if (track.isLocal()) {
        return;
      }

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
      this.updateRemoteVideos();
    });


    this.jitsiService.localVideoTrack.subscribe((track) => {
      this.localVideoTrack = track;
      if (track) {
        track.attach(document.getElementById('localVideo'));
        this.isLocalVideoSet = true;
      }
    });

    this.jitsiService.localAudioTrack.subscribe((audioTrack) => {
      this.localAudioTrack = audioTrack;
    });
  }

  addVideoElement(video: any) {
    console.log('--------------videoStream-------------------', video);
    console.log('hello');

    const videoStream = video.stream;


    const videoPersonElement = document.createElement('div');
    videoPersonElement.className = 'video-person';
    // videoPersonElement.id = 'video-person' + this.videoElementId;
    document.getElementById('remoteVideoContainer')!.appendChild(videoPersonElement);



    const videoContentElement = document.createElement('video');
    videoContentElement.srcObject = videoStream;
    videoContentElement.autoplay = true;
    videoContentElement.playsInline = true;
    videoContentElement.className = 'video-content';
    // videoContentElement.id = 'video' + this.videoElementId;

 
    const videoNameElement = document.createElement('div');
    videoNameElement.className = 'video-name';
    // videoNameElement.id = 'video-name' + this.videoElementId;
    videoNameElement.innerHTML = 'Participant ' + (+this.videoElementId + 2);
    // name.innerHTML = video.getDisplayName();
    videoPersonElement!.appendChild(videoContentElement);
    videoPersonElement!.appendChild(videoNameElement);


    this.videoElementId++;

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
    if (this.localVideoTrack) {
      this.localVideoTrack.detach(document.getElementById('localVideo'));
    }
    this.remoteVideoTracks.forEach((track) => {
      track.detach(
        document.getElementById(`remoteVideo-${track.getParticipantId()}`)
      );
    });
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
