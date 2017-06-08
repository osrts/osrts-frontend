// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, OnInit } from '@angular/core';
import { RaceService } from '../services/race/race.service';

import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [RaceService]
})
export class HomeComponent implements OnInit {

  race:any;
  days=[];


  constructor(private _raceService: RaceService) { }

  ngOnInit() {
    this._raceService.getWithPromise().then((data)=>{
      if(data.total==0){
        return;
      }
      this.race = data.data[0];
      let dateFrom = moment(this.race.from, "DD-MM-YYYY");
      let dateTo = moment(this.race.to, "DD-MM-YYYY");
      let dateTraveler = moment(dateFrom);
      while(dateTraveler.isSameOrBefore(dateTo)){
        this.days.push({dayOfWeek: dateTraveler.format("dddd"),
                        link: "/results/"+dateTraveler.format("DD-MM-YYYY")});
        dateTraveler.add(1, "days");
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
}
