// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class UsersService {

  private _socket;

  public usersSubject:Subject<any>;
  private dataStore: {
    users: any[]
  };

  constructor(private _socketService: SocketService) {
    this._socket = _socketService.getService('users');

    this._socket.on('created', (user) => this.onCreated(user));
    this._socket.on('patched', (user) => this.onUpdated(user));
    this._socket.on('removed', (user) => this.onRemoved(user));

    this.usersSubject = new Subject();

    this.dataStore = { users: []};
  }

  public find(query: any) {
    this._socket.find(query).then((data, err) => {
      if (err) return console.error(err);
      this.dataStore.users = data.data;
      this.usersSubject.next(this.dataStore.users);
    });
  }

  public findOne(id){
    return this._socket.get(id);
  }

  public create(user){
    return this._socket.create(user);
  }

  public patch(user){
    return this._socket.patch(user._id, user);
  }

  public remove(id){
    this._socket.remove(id);
  }

  // Methods used when event received from sockets

  private getIndex(id: string): number {
    let foundIndex = -1;
    for (let i = 0; i < this.dataStore.users.length; i++) {
      if (this.dataStore.users[i]._id === id) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }

  private onCreated(user) {
    this.dataStore.users.push(user);
    this.usersSubject.next(this.dataStore.users);
  }

  private onUpdated(user) {
    const index = this.getIndex(user._id);
    this.dataStore.users[index] = user;
    this.usersSubject.next(this.dataStore.users);
  }

  private onRemoved(user) {
    const index = this.getIndex(user._id);
    this.dataStore.users.splice(index, 1);
    this.usersSubject.next(this.dataStore.users);
  }
}
