// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SocketService } from '../feathers.service';
var promise = require('promise');


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private auth: SocketService, private router: Router) { }

    canActivate(): Promise<boolean> {
      return new Promise<boolean>((resolve, reject)=>{
        if(this.auth.isConnected()){
          resolve(true);
        }else if(window.localStorage['feathers-jwt']){
          this.auth.authenticateWithToken().then((result)=>{
            resolve(true);
          }).catch((error)=>{
            this.router.navigate(['/login']);
            reject(error);
          });
        }else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });

    }
}
