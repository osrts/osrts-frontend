// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, OnInit, Input, TemplateRef, ContentChild, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
    @ContentChild(TemplateRef) template: any;
    @Input() columns: any;
    @Input() checkpoints: any;
    @Input() nbPages: number;
    @Output() queryUpdated = new EventEmitter();
    sort: any = {}
    currentPage = 1;

    constructor() {}

    ngOnInit() {
        if(this.checkpoints){
            this.checkpoints.forEach((element)=>{
                this.columns.splice((this.columns.length - 1), 0, { 'title': element.title, 'num': element.num, 'checkpoint':true });
            })
        }
    }

    changePage(newPage) {
        if (newPage >= 1 && newPage <= this.nbPages) {
            this.currentPage = newPage;
        }
    }


      // When clicking a checkbox related to a checkpoint
      changeCheckpoint(checkpointNum){
          console.log("Change checkpoint")
        // var index = this.filters.checkpointsFilter.indexOf(checkpointNum);
        // if(index==-1){
        //   this.filters.checkpointsFilter.push(checkpointNum);
        // } else {
        //   this.filters.checkpointsFilter.splice(index, 1);
        // }
        // this.find();
      }

    clickColumn(column) {
        column.asc = !column.asc;
        this.sort.column = column.selector;
        this.sort.direction = column.asc ? 1 : -1;
        this.updateQuery();
    }

    updateQuery() {
        var query = {};
        query['$sort'] = {};
        query['$sort'][this.sort.column] = this.sort.direction
        var checkpoints = [];
        this.columns.forEach((element) => {
            if(element.checkpoint){
                if(element.data){
                    checkpoints.push(element.num)
                }
            }

            if (element.search && element.data) {
                if (element.selector == 'tag') {
                    if (isNaN(element.data)) {
                        let letter = element.data[0];
                        query['tag.color'] = { $search: letter };
                        if (element.data.length > 1) {
                            let num = parseInt(element.data.slice(1));
                            query['tag.num'] = num;
                        }
                    } else {
                        let num = parseInt(element.data);
                        query['tag.num'] = num;
                    }
                } else {
                    if(!element.numeric){
                      query[element.selector] = {$search: element.data};
                  } else if(element.numeric){
                      let num = parseInt(element.data);
                      if(!isNaN(num))
                        query[element.selector] = num;
                    }
                }
            }
        })

        if(checkpoints.length > 0){
            query['checkpoints_ids'] = {'$all': checkpoints}
        }
        this.queryUpdated.emit(query)
    }
}
