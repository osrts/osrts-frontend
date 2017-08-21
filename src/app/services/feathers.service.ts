// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const io = require('socket.io-client');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest/client');
const authentication = require('feathers-authentication-client');
const localstorage = require('feathers-localstorage');
const superagent = require('superagent');

const environment = require('../../environments/environment');

const HOST = environment.environment.socketUrl; // Your base server URL here

@Injectable()
export class SocketService {
  public socket: any;
  public _app: any;

  constructor() {
    this.socket = io(HOST); // Initialize socketio
    this._app = feathers() // Initialize feathers
      .configure(socketio(this.socket)) // Fire up socketio with feathers
      .configure(hooks()) // Configure feathers-hooks
      .configure(authentication({ storage: window.localStorage }));

    if(window.localStorage['feathers-jwt']){
      this.authenticateWithToken().then(data=>{
      }).catch(error=>{
        delete window.localStorage['feathers-jwt'];
        console.log(error);
      });
    }
  }

  getService(serviceName){
    return this._app.service(serviceName);
  }

  authenticate(user){
      // If the transport changes, you have to call authenticate() again.
     this.socket.on('upgrade', function(transport) {
       console.log('transport changed');
       this._app.authenticate();
     });
     // If we were disconnected, re-authenticate
     this.socket.on('reconnect', function(transport) {
       console.log('Reconnected');
       this._app.authenticate();
     });
    return this._app.authenticate({
      strategy: 'local',
      'email': user['email'],
      'password': user['password']
    });
  }

  authenticateWithToken(){
    return this._app.authenticate({
        type: 'token',
        'token': window.localStorage['feathers-jwt']
      });
  }

  isConnected(){
    return this._app.get('accessToken') != undefined;
  }

  logout(){
    this._app.logout();
  }
}
