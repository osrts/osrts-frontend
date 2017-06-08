// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WavesService } from '../../../services/waves/waves.service';
declare var jQuery:any;
declare var swal: any;
var swal = require('sweetalert2');
import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');

@Component({
    selector: 'app-waves',
    templateUrl: './waves-launcher.component.html',
    styleUrls: ['./waves-launcher.component.css'],
    providers: [WavesService]
})
export class WavesLauncherComponent implements OnInit, OnDestroy {

  subscription:Subscription;

  dateChosen="";

  waves=[];
  index=0;

  constructor(private _wavesService: WavesService) {
  }

  ngOnInit(){
      // Get the wave(s) with chrono for the dateChosen
      this.subscription = this._wavesService.wavesSubject.subscribe((data) => {
        this.waves = data.waves;
      });
      this.find();
  }

  find(){
    this._wavesService.find({query: {chrono: true, date: this.dateChosen}});
  }

  changeDate(date){
    this.dateChosen = date;
    this.find();
  }

  launchWave(wave){
    if(!wave['start_time'] || wave['start_time']==""){
      console.log(wave);
      var timestamp = moment().format("HH:mm:ss.SSSZZ");
      this._wavesService.patch(wave._id, {start_time: timestamp});
    }
  }

  resetWave(wave){
    swal({
      title: "Êtes-vous sûr ?",
      text: "Le temps de départ de cette vague va être supprimé !",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Compris!"
    }).then(()=> {
      this._wavesService.patch(wave._id, {start_time: ""});
    });
  }

  moment(date, format){
    return moment(date, format);
  }

  ngOnDestroy(){
    if(this.subscription)
      this.subscription.unsubscribe();
  }
}
