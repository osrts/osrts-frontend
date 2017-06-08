// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class TimesParserService {

  private _socketParser;

  public statusSubject: Subject<any>;

  constructor(
    private _socketService: SocketService,
  ) {
    this._socketParser = _socketService.getService('times-parser');

    this._socketParser.on('status', (status) => this.onStatus(status));

    this.statusSubject = new Subject();
  }

  public parseTxt(file){
    console.log("Parse")
    return this._socketParser.create(file).catch((err)=>{});
  }

  public onStatus(status){
    this.statusSubject.next(status);
  }
}
