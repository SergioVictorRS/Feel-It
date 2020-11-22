import { Vibration } from '@ionic-native/vibration/ngx';
import { Component } from '@angular/core';
import * as Tone from 'tone';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  synth = new Tone.Synth().toDestination();

  constructor(private vibration: Vibration) {}

  async vibrate(index) {
    this.synth.triggerAttackRelease('C4', '8n');
    const x = index[0];
    const y = index[1];
    const z = x * x + y * y;
    const sqrt = Math.sqrt(z);
    this.vibration.vibrate(0);
    this.vibration.vibrate([
      sqrt * 50
    ]);
  }
}
