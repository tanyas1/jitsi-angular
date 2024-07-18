import { Component } from '@angular/core';
import { JitsiService } from './jitsi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jitsi-angular-poc';
  roomname = '';
  username = '';

  constructor(private jitsiService: JitsiService) {}

  ngOnInit(): void {}

  join() {
    if (this.username) {
      this.jitsiService.username = this.username;
      this.jitsiService.connect();
    }
  }
}
