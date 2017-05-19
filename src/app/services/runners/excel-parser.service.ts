import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class ExcelParserService {

  private _socketParser;

  public statusSubject: Subject<any>;

  constructor(
    private _socketService: SocketService,
  ) {
    this._socketParser = _socketService.getService('excel-parser');

    this._socketParser.on('status', (status) => this.onStatus(status));

    this.statusSubject = new Subject();
  }

  public parseExcel(file){
    return this._socketParser.create(file).catch((err)=>{});
  }

  public onStatus(status){
    this.statusSubject.next(status);
  }
}
