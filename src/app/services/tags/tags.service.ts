import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class TagsService {

  NB_TAGS = 10;

  private _socket;

  private query:{};
  public tagsSubject:Subject<any>;
  private dataStore: {
    tags: any[],
    count: Number
  };

  constructor(
    private _socketService: SocketService
  ) {
    // Let's get both the socket.io and REST feathers services for tags!

    this._socket = _socketService.getService('tags');

    this._socket.on('created', (tag) => this.onCreated(tag));
    this._socket.on('updated', (tag) => this.onUpdated(tag));
    this._socket.on('removed', (tag) => this.onRemoved(tag));

    this.tagsSubject = new Subject();

    this.dataStore = { tags: [], count: 0};
  }

  public find(query: any) {
    this.query = query;
    this._socket.find(query).then((data, err) => {
      if (err) return console.error(err);
      this.dataStore.tags = data.data;
      this.dataStore.count = data.total;
      this.tagsSubject.next(this.dataStore);
    });
  }

  public findOne(id){
    return this._socket.get(id);
  }

  public create(range){
    this._socket.create(range);
  }

  public update(tag){
    this._socket.update(tag._id, tag);
  }

  public remove(range){
    var query = {query: {num: {$lte: range.to, $gte: range.from}}};
    if(range.color && range.color.length>1){
      console.log(range);
      query.query['color'] = range.color;
    }
    this._socket.remove(null, query);
  }

  // Methods used when event received from sockets

  private getIndex(id: string): number {
    let foundIndex = -1;
    for (let i = 0; i < this.dataStore.tags.length; i++) {
      if (this.dataStore.tags[i]._id === id) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }

  private onCreated(tag) {
    this.find(this.query);
  }

  private onUpdated(tag) {
    const index = this.getIndex(tag._id);
    this.dataStore.tags[index] = tag;
    this.tagsSubject.next(this.dataStore);
  }

  private onRemoved(tag) {
    this.find(this.query);
  }
}
