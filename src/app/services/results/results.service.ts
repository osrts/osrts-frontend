import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class ResultsService {

  public NB_RESULTS = 10;

  private _socket;

  public resultsSubject: Subject<any>;
  private dataStore: {
    results: any[],
    lastResult: any,
    count: any
  };

  private query= {};

  constructor(
    private _socketService: SocketService
  ) {
    this._socket = _socketService.getService('results');

    this._socket.on('created', (result) => this.onCreated(result));
    this._socket.on('updated', (result) => this.onUpdated(result));
    this._socket.on('patched', (result) => this.onUpdated(result));
    this._socket.on('removed', (result) => this.onRemoved(result));
    this.resultsSubject = new Subject();

    this.dataStore = { results: [], lastResult: {}, count: 0};
  }

  public find(query: any) {
    this.query = query;
    this._socket.find(query).then((data, err) => {
      if (err) return console.error(err);
      this.dataStore.results = data.data;
      this.dataStore.count = data.total;
      this.resultsSubject.next(this.dataStore);
    });
  }

  public update(result){
    return this._socket.update(result._id, result);
  }

  public remove(id){
    this._socket.remove(id);
  }

  private getIndex(id: string): number {
    let foundIndex = -1;
    for (let i = 0; i < this.dataStore.results.length; i++) {
      if (this.dataStore.results[i]._id === id) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }

  private onCreated(result) {
    if(this.dataStore.results.length<this.NB_RESULTS){
      this.dataStore.results.push(result);
    }
    this.dataStore.lastResult = result;
    this.dataStore.count = this.dataStore.count+1;
    this.resultsSubject.next(this.dataStore);
  }

  private compareNumber(a, b){
    if(a.number < b.number){
      return -1;
    } else if(a.number==b.number){
      return 0;
    } else {
      return 1;
    }
  }

  private onUpdated(result) {
    const index = this.getIndex(result._id);
    if(index!=-1){
      this.dataStore.results[index] = result;
      this.dataStore.results.sort(this.compareNumber);
      this.resultsSubject.next(this.dataStore);
    }
  }

  private onRemoved(result) {
    const index = this.getIndex(result._id);
    this.dataStore.results.splice(index, 1);
    this.resultsSubject.next(this.dataStore);
  }
}
