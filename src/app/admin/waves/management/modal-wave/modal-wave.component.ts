import { Component, OnInit, AfterViewInit} from '@angular/core';
import { WavesService } from '../../../../services/waves/waves.service';
import { RaceService } from '../../../../services/race/race.service';
import {IWave, Wave} from '../waves-management.component'
import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');
declare var jQuery: any;

@Component({
    selector: 'app-modal-wave',
    templateUrl: './modal-wave.component.html',
    styleUrls: ['./modal-wave.component.css'],
    providers: [WavesService, RaceService]
})
export class ModalWaveComponent implements OnInit, AfterViewInit{
    days=[];
    wave: IWave;
    create: boolean;

    constructor(private _wavesService:WavesService, private _raceService:RaceService) {
        this.wave = new Wave();
    }

  	ngOnInit(){
      this._raceService.getWithPromise().then((data)=>{
        if(data.total==0){
          return;
        }
        let race = data.data[0];
        let dateFrom = moment(race.from, "DD-MM-YYYY");
        let dateTo = moment(race.to, "DD-MM-YYYY");
        let dateTraveler = moment(dateFrom);
        while(dateTraveler.isSameOrBefore(dateTo)){
          this.days.push({dayOfWeek: dateTraveler.format("dddd"),
                          date: dateTraveler.format("DD-MM-YYYY")});
          dateTraveler.add(1, "days");
        }
        setTimeout(function(){
          jQuery('#wave-date').dropdown();
        }, 500);
      });
  	}

    ngAfterViewInit() {
        jQuery('#wave-type').dropdown();
    }

    load(wave) {
        if(wave){
            this.create = false;
            this.wave = Object.assign({}, wave);;
            jQuery('#wave-type').dropdown('set selected', wave.type);
            jQuery('#wave-date').dropdown('set selected', wave.date);
        }else{
            jQuery('#wave-type').dropdown('clear');
            jQuery('#wave-date').dropdown('clear');
            this.create = true;
            this.wave = new Wave();
        }
        jQuery('.wave-modal').modal('show')
    }

    save(){
        if(this.create){
          this._wavesService.create(this.wave);
        }else{
          this._wavesService.update(this.wave);
        }
    }
}
