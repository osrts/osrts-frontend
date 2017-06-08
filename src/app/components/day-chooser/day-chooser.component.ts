// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { RaceService } from '../../services/race/race.service';
import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');

@Component({
    selector: 'app-day-chooser',
    templateUrl: './day-chooser.component.html',
    styleUrls: ['./day-chooser.component.css'],
    providers: [RaceService]
})
export class DayChooserComponent implements OnInit {
    @Output() changeDateEmitter = new EventEmitter();
    days = [];
    dateChosen = "";
    constructor(private _raceService: RaceService) { }

    ngOnInit() {
        this._raceService.getWithPromise().then((data) => {
            let race = data.data[0];
            if (race) {
                this.dateChosen = race.from;
                let dateFrom = moment(race.from, "DD-MM-YYYY");
                let dateTo = moment(race.to, "DD-MM-YYYY");
                let dateTraveler = moment(dateFrom);
                while (dateTraveler.isSameOrBefore(dateTo)) {
                    this.days.push({
                        dayOfWeek: dateTraveler.format("dddd"),
                        date: dateTraveler.format("DD-MM-YYYY")
                    });
                    dateTraveler.add(1, "days");
                }
                this.changeDate(this.dateChosen)
            }
        });
    }

    changeDate(date) {
        this.dateChosen = date;
        this.changeDateEmitter.emit(date);
    }
}
