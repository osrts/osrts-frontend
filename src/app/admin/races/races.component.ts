// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RaceService } from '../../services/race/race.service';
import { FormsModule } from '@angular/forms';
import {Subscription} from 'rxjs';

var swal = require('sweetalert2');
import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');

declare var jQuery:any;

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css'],
  providers: [RaceService]
})
export class RacesComponent implements OnInit, AfterViewInit, OnDestroy {
  // The race
  race: any;
  raceToBeModified:any;
  subscription:Subscription;
  // To print
  dateFrom: any;
  dateTo: any;
  now: any;

  hasChecked:boolean;
  action:string;

  constructor(private _raceService: RaceService) {
    this.now = new Date();
    this.hasChecked=false;
    this.action = "";
    this.race = {};
    this.raceToBeModified = {};
  }

  ngOnInit(){
    this.subscription = this._raceService.raceSubject.subscribe((data)=>{
      if(!data){
        this.race = {};
        return;
      }
      this.race = data;
      this.dateFrom = moment(this.race.from, "DD-MM-YYYY");
      this.dateTo = moment(this.race.to, "DD-MM-YYYY");
    });
    this._raceService.get();
  }

  ngAfterViewInit(){
    jQuery('.ui.modal-race').modal({closable: false});
    jQuery('[data-toggle="datepicker_from"]').datepicker({format: 'dd-mm-yyyy', language: 'fr-FR'});
    jQuery('[data-toggle="datepicker_to"]').datepicker({format: 'dd-mm-yyyy', language: 'fr-FR'});
    jQuery('[data-toggle="datepicker_from"]').on('pick.datepicker', (e) => {
      this.raceToBeModified.from = moment(e.date).format('DD-MM-YYYY');
    });
    jQuery('[data-toggle="datepicker_to"]').on('pick.datepicker', (e) => {
      this.raceToBeModified.to  = moment(e.date).format('DD-MM-YYYY');
    });
  }

  clickOpenForm(newAction:string){
    jQuery('.ui.modal-race').modal('show');
    this.hasChecked = false;
    this.action=newAction;
    if(newAction == 'add'){
      this.raceToBeModified = {};
      this.raceToBeModified._id = this.race._id;
    }else{
      this.raceToBeModified = Object.assign({}, this.race);

    }
  }

  clickCancel(){
    jQuery('.ui.modal-race').modal('hide');
    this.action="";
    this.raceToBeModified={};
  }

  submitForm($event){
    if(this.checkDates()){
      if(this.action=='add'){
        if(!this.dateFrom){
          this._raceService.create(this.raceToBeModified);
        } else {
          this.raceToBeModified.tagsColor = this.race.tagsColor;
          this._raceService.update(this.raceToBeModified);
        }
      } else {
        this._raceService.patch(this.raceToBeModified);
      }
      this.clickCancel();
    } else {
      swal({
          title: 'Les dates ne sont pas valides !',
          type: 'warning'
        });
    }
  }

  checkDates(){
    var momentFrom = moment(this.raceToBeModified.from, "DD-MM-YYYY", true);
    var momentTo = moment(this.raceToBeModified.to, "DD-MM-YYYY", true);
    return momentFrom.isValid() && momentTo.isValid() && momentFrom.isSameOrBefore(momentTo);
  }

  ngOnDestroy(){
    if(this.subscription)
      this.subscription.unsubscribe();
  }
}
