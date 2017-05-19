import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class TimesService {
  private _socket;

  public timesSubject: Subject<any>;
  private dataStore: {
    times: any[],
    count: Number
  };

  constructor(
    private _socketService: SocketService
  ) {
    this._socket = _socketService.getService('times');

    this._socket.on('created', (time) => this.onCreated(time));
    this._socket.on('updated', (time) => this.onUpdated(time));
    this._socket.on('removed', (time) => this.onRemoved(time));

    this.timesSubject = new Subject();

    this.dataStore = { times: [], count: 0 };
  }

  public find(query: any) {
    this._socket.find(query).then((data, err) => {
      if (err) return console.error(err);
      this.dataStore.times = data.data;
      this.dataStore.count = data.total;
      this.timesSubject.next(this.dataStore);
    });
  }

  public findOne(id){
    return this._socket.get(id);
  }

  public create(time){
    return this._socket.create(time)
  }

  public update(times){
    this._socket.update(times._id, times);
  }

// Testing purpose
  public remove(id){
    this._socket.remove(id);
  }

 // Methods used when event received from sockets
  private getIndex(id: string): number {
    let foundIndex = -1;
    for (let i = 0; i < this.dataStore.times.length; i++) {
      if (this.dataStore.times[i]._id === id) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }

  private onCreated(time) {
    this.find({query : {$sort: { timestamp: -1}}});
    // this.dataStore.times.push(result);
    // this.timesSubject.next(this.dataStore);
  }

  private onUpdated(time) {
    const index = this.getIndex(time._id);
    this.dataStore.times[index] = time;
    this.timesSubject.next(this.dataStore);
  }

  private onRemoved(time) {
    const index = this.getIndex(time._id);
    this.dataStore.times.splice(index, 1);
    this.timesSubject.next(this.dataStore);
  }
}
