import { Component, OnInit, OnDestroy} from '@angular/core';
import { ResultsService } from '../../services/results/results.service';
import { CheckpointsService } from '../../services/checkpoints/checkpoints.service';
import { TableComponent } from '../../components/table/table.component'
import { DayChooserComponent } from '../../components/day-chooser/day-chooser.component'
import {Subject} from 'rxjs';
import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');
declare var jQuery: any;
var swal = require('sweetalert2');
import {Subscription} from 'rxjs';

const TIMES_PER_PAGE = 10;

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css'],
    providers: [ResultsService, CheckpointsService, TableComponent, DayChooserComponent]
})
export class ResultsComponent implements OnInit, OnDestroy {
    loaded = false;
    subscription: Subscription;
    results = [];
    data: any;
    checkpoints = [];
    // paging
    currentPage = 1;
    // Filtering
    query: any = {};
    // Days management
    dateChosen = "";
    resultToBeModified : any = {};

    columns = [
        { 'title': 'N°', 'selector': 'number', 'order': true, 'search': true, 'numeric': true, 'class': 'one wide' },
        { 'title': 'Nom', 'selector': 'name', 'order': true, 'search': true, 'numeric': false },
        { 'title': 'Tag', 'selector': 'tag', 'order': false, 'search': true, 'numeric': false },
        { 'title': 'Team', 'selector': 'team_name', 'order': true, 'search': true, 'numeric': false },
        { 'title': 'Date', 'selector': 'date', 'order': false, 'search': false, 'numeric': false },
        { 'title': 'Start', 'selector': 'start_time', 'order': true, 'search': false, 'numeric': false },
        { 'title': 'Actions', 'selector': 'date', 'order': false, 'search': false, 'numeric': false, 'btn': true, class: 'two wide' },
    ];

    constructor(
        private _checkpointsService: CheckpointsService,
        private _resultsService: ResultsService
    ) {
        this._resultsService = _resultsService;
        this._checkpointsService = _checkpointsService;
    }

    ngOnInit() {
        this.subscription = this._resultsService.resultsSubject.subscribe((data) => {
            this.data = data;
            this.loaded = true;
        });

        this._checkpointsService.findWithPromise({ query: { $sort: { num: 1 } } }).then(data => {
            this.checkpoints = data.data;
        });
        this.find();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    handleQueryUpdated(query) {
        this.query = query;
        this.find()
    }

    find() {
        this.query['date'] = this.dateChosen;
        this.query['$skip'] = (this.currentPage - 1) * TIMES_PER_PAGE;
        this.query['$limit'] = TIMES_PER_PAGE;
        console.log(this.query)
        this._resultsService.find({ query: this.query });
    }

    changePage(newPage) {
        this.currentPage = newPage;
        this.find();
    }

    changeDate(date) {
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
            this._resultsService.remove(key);
            this.find();
            swal(
                'Supprimé !'
            )
        }).catch(e => {});
    }

    // Function that opens the modal for modifying a checkpoint
    // edit(result) {
    //     console.log("Edit ")
    //     // console.log(result)
    //     Object.assign(this.resultToBeModified, result)
    //
    //     this.checkpoints.forEach((element)=>{
    //         if(!this.resultToBeModified.times[element.num]){
    //             this.resultToBeModified.times[element.num] = {};
    //         }else{
    //             this.resultToBeModified.times[element.num].input = moment(this.resultToBeModified.times[element.num].time).utc().format("HH:mm:ss")
    //         }
    //     })
    //     // this.checkpointToBeModified = checkpoint;
    //     jQuery('.ui.modal-result').modal('show');
    // }
    //
    // updateResult(){
    //     // console.log(this.resultToBeModified.times)
    //     this.checkpoints.forEach((element)=>{
    //         if(this.resultToBeModified.times[element.num].input){
    //             var date;
    //             if(this.resultToBeModified.times[element.num].time){
    //                 console.log("Time exists")
    //                 date = moment(this.resultToBeModified.times[element.num].time)
    //             }else{
    //                 console.log("New exists")
    //                 date = moment(0)
    //             }
    //             var splitTime = this.resultToBeModified.times[element.num].input.split(/:/)
    //             date.set('hour', splitTime[0]);
    //             date.add(1,'hours')
    //             date.set('minute', splitTime[1]);
    //             date.set('second', splitTime[2]);
    //
    //             delete this.resultToBeModified.times[element.num].input
    //             this.resultToBeModified.times[element.num].time = date.toDate();
    //         }else{
    //             delete this.resultToBeModified.times[element.num]
    //         }
    //     });
    //
    //
    //     this._resultsService.update(this.resultToBeModified).then(()=>{
    //         console.log("Success")
    //     }).catch((err)=>{
    //         console.log(err)
    //     });
    //     jQuery('.ui.modal-result').modal('hide');
    // }
    //
    // // Cancel in modal
    // closeModal(){
    //   jQuery('.ui.modal-result').modal('hide');
    //   this.resultToBeModified={};
    // }
}
