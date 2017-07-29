// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class RunnersService {

  NB_RUNNERS = 10;

  private _socket;

  public runnersSubject:Subject<any>;
  private dataStore: {
    runners: any[],
    count: Number
  };

  constructor(private _socketService: SocketService){

    this._socket = _socketService.getService('runners');

    this._socket.on('created', (runner) => this.onCreated(runner));
    this._socket.on('updated', (runner) => this.onUpdated(runner));
    this._socket.on('patched', (runner) => this.onUpdated(runner));
    this._socket.on('removed', (runner) => this.onRemoved(runner));

    this.runnersSubject = new Subject();

    this.dataStore = { runners: [], count: 0};
  }

  public find(query: any) {
    this._socket.find(query).then((data, err) => {
      if (err) return console.error(err);
      this.dataStore.runners = data.data;
      this.dataStore.count = data.total;
      this.runnersSubject.next(this.dataStore);
    });
  }

  public findOne(id){
    return this._socket.get(id);
  }

  public update(runner){
    return this._socket.update(runner._id, runner);
  }

  public remove(id){
    this._socket.remove(id);
  }

  // Methods used when event received from sockets

  private getIndex(id: string): number {
    let foundIndex = -1;
    for (let i = 0; i < this.dataStore.runners.length; i++) {
      if (this.dataStore.runners[i]._id === id) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }

  private onCreated(runner) {
    this.dataStore.runners.push(runner);
    this.runnersSubject.next(this.dataStore);
  }

  private onUpdated(runner) {
    const index = this.getIndex(runner._id);
    this.dataStore.runners[index] = runner;
    this.runnersSubject.next(this.dataStore);
  }

  private onRemoved(runner) {
    const index = this.getIndex(runner._id);
    this.dataStore.runners.splice(index, 1);
    this.runnersSubject.next(this.dataStore);
  }
}
