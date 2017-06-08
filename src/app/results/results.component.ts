// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultsService } from '../services/results/results.service';
import { CheckpointsService } from '../services/checkpoints/checkpoints.service';
import { SocketService } from '../services/feathers.service';

import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');

const FORMAT_TIME = "YYYY-MM-DDTHH:mm:ss.SSSS";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  providers: [ResultsService, CheckpointsService]
})
export class ResultsComponent implements OnInit, OnDestroy {

  loaded=false;
  parentRouter:any;
  routeSubscription:any;
  // Query results
  results=null;
  lastResult={};
  resultsSubscription: Subscription;
  // Checkpoints
  checkpoints=[];
  // Day
  date:String;
  momentDate:any;
  // Filtering
  filters={nameFilter:"", teamNameFilter: "", checkpointsFilter: []};
  // Paging
  nbPages=1;
  currentPage=1;
  isConnected: Boolean = false;
  constructor(private route: ActivatedRoute, private router:Router,
      private _resultsService: ResultsService,
      private _checkpointsService: CheckpointsService,
      private auth: SocketService
  ) {
    this.parentRouter = router;
    this.isConnected = this.auth.isConnected();
  }

  ngOnInit() {
    // Route subscription
    this.routeSubscription = this.route.params.subscribe(params => {
      if(!params['date']){
        this.parentRouter.navigateByUrl('');
      }
      this.date = params['date'];
      this.momentDate = moment(this.date, "DD-MM-YYYY");

      // Results subscription
      this.resultsSubscription = this._resultsService.resultsSubject.subscribe((data) => {
        if(!this.results && data.results.length==0){
          this.loaded=true;
          return;
        }
        this.results = data.results;
        this.lastResult = data.lastResult;
        for(var r of this.results){
          for (var k in r.times){
            if (r.times.hasOwnProperty(k))
              r.times[k].timeMoment = moment(r.times[k].time, FORMAT_TIME);
          }
        }
        for (var k in this.lastResult['times']){
          if (this.lastResult['times'].hasOwnProperty(k))
            this.lastResult['times'][k].timeMoment = moment(this.lastResult['times'][k].time, FORMAT_TIME);
        }
        this.nbPages = Math.ceil(data.count/this._resultsService.NB_RESULTS);
        this.loaded=true;
      }, (err) => {
        console.error(err);
      });

      this._checkpointsService.findWithPromise({query: {$sort: {num: 1}}}).then(data=>{
        this.checkpoints = data.data;
      });

      this.find();
    });
  }

  // Query

  find(){
    let query = {date: this.date, $sort: { 'number': 1}};
    this.checkAndAddFilter(query, 'name', this.filters['nameFilter'], false);
    this.checkAndAddFilter(query, 'team_name', this.filters['teamNameFilter'], false);
    if(this.filters.checkpointsFilter.length>0){
      query['checkpoints_ids'] = {$all: this.filters.checkpointsFilter};
    }
    query['$skip'] = (this.currentPage-1)*this._resultsService.NB_RESULTS;
    query['$limit'] = this._resultsService.NB_RESULTS;
    console.log(query)
    this._resultsService.find({query: query});
  }

  checkAndAddFilter(query, field, filter, numeric){
    if(filter!=""){
      if(!numeric){
        query[field] = {$search: filter};
      } else if(numeric){
        let num = parseInt(filter);
        if(!isNaN(num))
          query[field] = num;
      }
    }
  }

  // When clicking a checkbox related to a checkpoint
  changeCheckpoint(checkpointNum){
    var index = this.filters.checkpointsFilter.indexOf(checkpointNum);
    if(index==-1){
      this.filters.checkpointsFilter.push(checkpointNum);
    } else {
      this.filters.checkpointsFilter.splice(index, 1);
    }
    this.find();
  }

  // ######
  // Paging
  // ######

  changePage(newPage){
    if(newPage>=1 && newPage<=this.nbPages){
      this.currentPage=newPage;
      this.find();
    }
  }

  ngOnDestroy() {
   this.routeSubscription.unsubscribe();
   this.resultsSubscription.unsubscribe();
  }
}
