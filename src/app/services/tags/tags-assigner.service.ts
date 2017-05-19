import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { SocketService } from '../feathers.service';

@Injectable()
export class TagsAssignerService {

  private _socketTagsAssigner;

  public statusSubject: Subject<any>;

  constructor(
    private _socketService: SocketService,
  ) {
    this._socketTagsAssigner = _socketService.getService('tags-assigner');

    this._socketTagsAssigner.on('status', (status) => this.onStatus(status));

    this.statusSubject = new Subject();
  }

  public assignTags(){
    return this._socketTagsAssigner.create({});
  }

  public onStatus(status){
    this.statusSubject.next(status);
  }
}
