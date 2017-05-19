import { Component, OnInit, OnDestroy} from '@angular/core';
import { WavesService } from '../../../services/waves/waves.service';
declare var jQuery:any;
var swal = require('sweetalert2');
import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');

@Component({
    selector: 'app-waves',
    templateUrl: './waves-management.component.html',
    styleUrls: ['./waves-management.component.css'],
    providers: [WavesService]
})
export class WavesManagementComponent implements OnInit, OnDestroy {
    loaded=false;
    dateChosen="";
    subscription:any;
    waves=[];

    constructor(private _wavesService: WavesService) {}

    ngOnInit(){
        this.subscription = this._wavesService.wavesSubject.subscribe((data)=>{
          this.waves = data.waves;
        });
        this.find();
    }

    find(){
      this._wavesService.find({query: {date: this.dateChosen, $sort: {num: 1}}});
    }

    ngOnDestroy(){
      if(this.subscription)
        this.subscription.unsubscribe();
    }

    changeDate(date){
      this.dateChosen = date;
      this.find();
    }

    remove(key:string){
        swal({
            title: 'Êtes-vous sûr ?',
            text: "Les données ne pourront plus être récupérées!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Compris'
        }).then(()=> {
            this._wavesService.remove(key);
            swal(
                'Supprimé !'
            )
        }).catch(e => {});
    }
}

export interface IWave {
    $key?: string;
    createdAt: number;
    num: number;
    date: string;
    type: string;
    chrono: boolean;
}

export class Wave implements IWave {
    createdAt: number;
    num: number;
    date: string;
    type: string;
    chrono: boolean;

    constructor() {
        this.num = 0;
        this.date = "";
        this.type = "";
        this.chrono = false;
    }
}
