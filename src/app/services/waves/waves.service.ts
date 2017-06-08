// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class WavesService {

  private _socket;

  public wavesSubject: Subject<any>;
  private dataStore: {
    waves: any[]
  };

  constructor(
    private _socketService: SocketService
  ) {
    this._socket = _socketService.getService('waves');

    this._socket.on('created', (wave) => this.onCreated(wave));
    this._socket.on('updated', (wave) => this.onUpdated(wave));
    this._socket.on('patched', (wave) => this.onUpdated(wave));
    this._socket.on('removed', (wave) => this.onRemoved(wave));

    this.wavesSubject = new Subject();

    this.dataStore = { waves: []};
  }

  public find(query: any) {
    this._socket.find(query).then((data, err) => {
      if (err) return console.error(err);
      this.dataStore.waves = data.data;
      this.wavesSubject.next(this.dataStore);
    });
  }

  public findWithPromise(query: any){
    return this._socket.find(query);
  }

  public findOne(id){
    return this._socket.get(id);
  }

  public create(wave){
    this._socket.create(wave).then((result, error)=>{
      console.log(result);
      console.log(error);
    });
  }

  public patch(id, waveData){
    this._socket.patch(id, waveData);
  }

  public update(wave){
    this._socket.update(wave._id, wave);
  }

  public remove(id){
    this._socket.remove(id);
  }

  // Methods used when event received from sockets

  private getIndex(id: string): number {
    let foundIndex = -1;
    for (let i = 0; i < this.dataStore.waves.length; i++) {
      if (this.dataStore.waves[i]._id === id) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }

  private onCreated(wave) {
    this.dataStore.waves.push(wave);
    this.wavesSubject.next(this.dataStore);
  }

  private onUpdated(wave) {
    const index = this.getIndex(wave._id);
    this.dataStore.waves[index] = wave;
    this.wavesSubject.next(this.dataStore);
  }

  private onRemoved(wave) {
    const index = this.getIndex(wave._id);
    this.dataStore.waves.splice(index, 1);
    this.wavesSubject.next(this.dataStore);
  }
}
