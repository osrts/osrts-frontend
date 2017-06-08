// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class RaceService {
  private _socket;

  public raceSubject: Subject<any>;
  private feathersService: any;
  private dataStore: {
    race: any
  };

  constructor(
    private _socketService: SocketService
  ) {
    this._socket = _socketService.getService('race');

    this._socket.on('created', (race) => this.onCreated(race));
    this._socket.on('updated', (race) => this.onUpdated(race));
    this._socket.on('patched', (race) => this.onUpdated(race));
    this.raceSubject = new Subject();

    this.dataStore = { race: {} };
  }

  public get() {
    this._socket.find().then((data, err) => {
      if (err) return console.error(err);
      this.dataStore.race = data.data[0];
      this.raceSubject.next(this.dataStore.race);
    });
  }

  public getWithPromise(){
    return this._socket.find();
  }

  public create(race){
    this._socket.create(race);
  }

  public update(race){
    this._socket.update(race._id, race);
  }

  public patch(race){
    this._socket.patch(race._id, race);
  }

  private onCreated(race){
    this.dataStore.race = race;
    this.raceSubject.next(this.dataStore.race);
  }

  private onUpdated(race) {
    this.dataStore.race = race;
    this.raceSubject.next(this.dataStore.race);
  }
}
