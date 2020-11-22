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
  actualNote = 'Gire o Celular para Escolher uma nota';
  actualOctave = '';
  acelerometerSubscription: Subscription;
  isFirst = true;
  isSecond = true;
  octaves = ['2n', '4n', '6n', '8n'];
  frequences = [2.5, 5, 7.5, 10];

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
    this.acelerometerSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.TouchSong();
  }

  ngOnInit(): void {
    this.TouchSong();
  }

  storeNote(x: number , y: number): void{
    const note = this.getNote(x);
    const frequence = 4;
    this.actualOctave = this.getOctave(x, y);
    this.actualNote = note.pt;
    const actualNoteEn = note.en + frequence;
    this.choosedNotesAndOctaves.push({note: actualNoteEn, octave: this.actualOctave});
    this.synth.triggerAttackRelease(actualNoteEn, this.actualOctave);
  }

  getFrequence(y: number): number {
    return this.frequences.findIndex(f => f >= y) + 4;
  }

  private getNote(x: number): any {
    x = x < 0 ? x * -1 : x ;
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

  private TouchSong() {
    // Get the device current acceleration
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
      .watchAcceleration({frequency: 5000})
      .subscribe((ac: DeviceMotionAccelerationData) => {
        this.storeNote(ac.x, ac.y);
      });
  }

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
