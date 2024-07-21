import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  private connection: any;
  private room: any;
  private localTracks: any[] = [];
  private remoteTracks: any = {};
  public localVideoTrack: BehaviorSubject<any> = new BehaviorSubject(null);
  public localAudioTrack: BehaviorSubject<any> = new BehaviorSubject(null);
  public remoteVideoTracks: BehaviorSubject<any> = new BehaviorSubject([]);
  public remoteAudioTracks: BehaviorSubject<any> = new BehaviorSubject([]);

  remoteTrackCalled: BehaviorSubject<any> = new BehaviorSubject('');

  username = '';

  constructor() {
    this.initJitsi();
  }

  private initJitsi() {
    JitsiMeetJS.init();
  }

  connect() {
    this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
      hosts: {
        domain: 'meet.jitsi',
        muc: 'muc.meet.jitsi',
      },
      serviceUrl: 'https://meet.connectandsell.com/http-bind',
    });

    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess.bind(this)
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed.bind(this)
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.onConnectionDisconnected.bind(this)
    );

    const username = 'coditas@meet.jitsi';
    const password = 'c0ditas'; 

    this.connection.connect({
      id: username,
      password: password
  });
  }

  private onConnectionSuccess() {
    this.room = this.connection.initJitsiConference('bullpen', {});
    this.room.setDisplayName('tanya');

    this.room.on(
      JitsiMeetJS.events.conference.TRACK_ADDED,
      this.onRemoteTrack.bind(this)
    );

    this.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, (track: any) => {
      console.log(`track removed!!!${track}`);
    });
    this.room.on(
      JitsiMeetJS.events.conference.CONFERENCE_JOINED,
      this.onConferenceJoined.bind(this)
    );
    this.room.on(JitsiMeetJS.events.conference.USER_JOINED, (id: any) => {
      console.log('user join');
      this.remoteTracks[id] = [];
    });
    this.room.on(
      JitsiMeetJS.events.conference.USER_LEFT,
      this.onUserLeft.bind(this)
    );
    this.room.on(
      JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED,
      (track: any) => {
        // console.log(`${track.getType()} - ${track.isMuted()}`);
      }
    );
    this.room.on(
      JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
      (userID: any, displayName: any) =>
        console.log(`${userID} - ${displayName}`)
    );
    this.room.on(
      JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
      (userID: any, audioLevel: any) => {
        // console.log(`${userID} - ${audioLevel}`)
      }
    );
    this.room.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, () =>
      console.log(`${this.room.getPhoneNumber()} - ${this.room.getPhonePin()}`)
    );
    this.room.join();
    this.createLocalTracks();
  }

  private onConferenceJoined() {
    console.log('-----------------USER JOINED-------------');
    // const myId = this.room.myUserId();
    // const myParticipant = this.room.getParticipantById(myId);
    // myParticipant.setDisplayName(this.username);
  }

  private onUserLeft() {
    console.log('-----------------USER LEFT-------------');
  }

  private onConnectionFailed() {
    console.error('Connection Failed!');
  }

  private onConnectionDisconnected() {
    console.log('Disconnected!');
  }

  private createLocalTracks() {
    JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video'] })
      .then((tracks: any) => {
        this.localTracks = tracks;
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i].getType() === 'video') {
            this.localVideoTrack.next(tracks[i]);
          } else {
            this.localAudioTrack.next(tracks[i]);
          }
          this.room.addTrack(tracks[i]);
        }
      })
      .catch((error: any) => {
        throw error;
      });
  }

  private onRemoteTrack(track: any) {
    this.remoteTrackCalled.next(track);

    // console.warn(
    //   '---------------------- REMOTE TRACK CALLED -----------------------'
    // );
    // if (track.isLocal()) {
    //   return;
    // }
    // const participantId = track.getParticipantId();

    // console.log('participantId ------->', participantId);
    // if (!this.remoteTracks[participantId]) {
    //   console.warn(
    //     '--------------------REMOTE TRACKS CLEARED--------------------------'
    //   );
    //   this.remoteTracks[participantId] = [];
    // }

    // this.remoteTracks[participantId].push(track);

    // if (track.getType() === 'video') {
    //   this.remoteVideoTracks.next(this.remoteTracks[participantId]);
    // } else {
    //   this.remoteAudioTracks.next(this.remoteTracks[participantId]);
    // }
  }

  leaveConference() {
    // this.connection.disconnect();
    this.room.leave();
    // this.room.leaveConference();
  }
}
