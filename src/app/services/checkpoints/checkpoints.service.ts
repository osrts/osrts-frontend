import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class CheckpointsService {

  private _socket;

  public checkpointsSubject: Subject<any>;
  private dataStore: {
    checkpoints: any[]
  };

  constructor(
    private _socketService: SocketService
  ) {
    // Let's get both the socket.io and REST feathers services for checkpoints!

    this._socket = _socketService.getService('checkpoints');

    this._socket.on('created', (checkpoint) => this.onCreated(checkpoint));
    this._socket.on('updated', (checkpoint) => this.onUpdated(checkpoint));
    this._socket.on('removed', (checkpoint) => this.onRemoved(checkpoint));
    this._socket.on('patched', (checkpoint) => this.onPatched(checkpoint));

    this.checkpointsSubject = new Subject();

    this.dataStore = { checkpoints: []};
  }

  public find(query: any) {
    this._socket.find(query).then((data, err) => {
      if (err) return console.error(err);
      this.dataStore.checkpoints = data.data;
      this.checkpointsSubject.next(this.dataStore);
    });
  }

  public findWithPromise(query: any){
    return this._socket.find(query);
  }

  public findOne(id){
    return this._socket.get(id);
  }

  public create(checkpoint){
    this._socket.create(checkpoint).then((result, error) => {
      if(error)
        console.log(error);
    });
  }

  public update(checkpoint){
    this._socket.update(checkpoint._id, checkpoint);
  }

  public remove(id){
    this._socket.remove(id);
  }

  // Methods used when event received from sockets
  private getIndex(id: string): number {
    let foundIndex = -1;
    for (let i = 0; i < this.dataStore.checkpoints.length; i++) {
      if (this.dataStore.checkpoints[i]._id === id) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }

  private onCreated(checkpoint) {
    this.dataStore.checkpoints.push(checkpoint);
    this.checkpointsSubject.next(this.dataStore);
  }

  private onUpdated(checkpoint) {
    const index = this.getIndex(checkpoint._id);
    this.dataStore.checkpoints[index] = checkpoint;
    this.checkpointsSubject.next(this.dataStore);
  }

   private onPatched(checkpoint) {
    const index = this.getIndex(checkpoint._id);
    this.dataStore.checkpoints[index] = checkpoint;
    this.checkpointsSubject.next(this.dataStore);
  }

  private onRemoved(checkpoint) {
    const index = this.getIndex(checkpoint._id);
    this.dataStore.checkpoints.splice(index, 1);
    this.checkpointsSubject.next(this.dataStore);
  }
}
