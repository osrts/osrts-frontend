// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../feathers.service';


@Injectable()
export class UnauthGuard implements CanActivate {
    constructor(private auth: SocketService, private router: Router) { }

    canActivate(): boolean {
        if(this.auth.isConnected()){
          this.router.navigate(['/admin']);
          return false;
        }else{
          return true;
        }
    }
}
