import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from '@ionic-native/device-motion/ngx';
import * as Tone from 'tone';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit, OnChanges, OnDestroy {
  synth = new Tone.Synth().toDestination();

  choosedNotesAndOctaves = [];
  actualNote = '';

  actualOctave = '';
  acelerometerSubscription: Subscription;

  isFirst = true;
  isSecond = true;
  isSharp = false;

  octaves = ['2n', '3n', '5n', '8n'];
  frequences = [2.5, 5, 7.5, 10];
  actualFrequence = 4;

  timeBeetwenNotes = 1500;

  notes = [
    { pt: 'DÓ', en: 'C', maxRange: 1.43 },
    { pt: 'RÉ', en: 'D', maxRange: 2.86 },
    { pt: 'MI', en: 'E', maxRange: 4.29 },
    { pt: 'FÁ', en: 'F', maxRange: 5.72 },
    { pt: 'SOL', en: 'G', maxRange: 7.15 },
    { pt: 'LÁ', en: 'A', maxRange: 8.58 },
    { pt: 'SI', en: 'B', maxRange: 10 },
  ];

  constructor(
    private deviceMotion: DeviceMotion,
    public alertController: AlertController
  ) {}

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  updateAccelerationTime(){
    this.acelerometerSubscription.unsubscribe();
    this.TouchSong();
  }

  getTimeBetweenNotesInSeconds(): string {
    const seconds = this.timeBeetwenNotes / 1000;
    return seconds + 's';
  }

  storeNote(x: number , y: number): void{
    const note = this.getNote(x);
    this.actualOctave = this.getOctave(x, y);
    this.actualNote = this.isSharp ? (note.pt + '#') : note.pt;
    const actualNoteEn = this.isSharp ?
    (note.en + '#' + this.actualFrequence) : (note.en + this.actualFrequence);
    this.choosedNotesAndOctaves.push({note: actualNoteEn, octave: this.actualOctave});
    this.synth.triggerAttackRelease(actualNoteEn, this.actualOctave);
  }

  getFrequence(y: number): number {
    return this.frequences.findIndex(f => f >= y) + 4;
  }

  private getNote(x: number): any {
    x = x < 0 ? x * -1 : x ;
    x = x > 10 ? (x % 10) : x;
    const index = this.notes.findIndex(note => note.maxRange >= x);
    return this.notes[index];
  }

  private getOctave(x: number, y: number): string {
    if (x >= 0 && y >= 0) {
      return this.octaves[0];
    } else if (x >= 0 && y <= 0) {
      return this.octaves[1];
    } else if (x < 0 && y > 0){
      return this.octaves[2];
    } else {
      return this.octaves[3];
    }
  }

    // Get the device current acceleration and Store Notes
    public TouchSong() {
    this.deviceMotion.getCurrentAcceleration().then(
      (ac: DeviceMotionAccelerationData) => {
        if (this.isFirst) {
          this.isFirst = false;
        }
        else{
          this.storeNote(ac.x, ac.y);
        }
      }, (error: any) => console.log(error)
    );

    // Watch device acceleration
    this.acelerometerSubscription = this.deviceMotion
      .watchAcceleration({frequency: this.timeBeetwenNotes})
      .subscribe((ac: DeviceMotionAccelerationData) => {
        this.storeNote(ac.x, ac.y);
      });
  }

  // Activate Sharp
  activateSharp() {
    this.isSharp = true;
  }

  // Unactivate Sharp
  unactiveSharp(){
    this.isSharp = false;
  }

  // Stop Note and Touch Song
  stop(): void {
    const now = Tone.now();
    this.acelerometerSubscription.unsubscribe();
    let index = 1;
    this.choosedNotesAndOctaves.forEach(note => {
      this.synth.triggerAttackRelease(note.note, note.octave, now + index );
      index = index + 1;
    });
    this.choosedNotesAndOctaves = [];
    this.TouchSong();
  }
}
