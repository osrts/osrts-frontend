import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
const TIMES_PER_PAGE = 10;

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})

export class PaginationComponent implements OnInit {
    @Output() changePageEmitter = new EventEmitter();
    @Input() count: number;
    currentPage = 1;
    nbPages = 1;

    constructor() { }

    ngOnChanges() {
        this.currentPage = 1;
        this.nbPages = Math.ceil(this.count / TIMES_PER_PAGE)
    }

    ngOnInit() {}

    changePage(newPage) {
        if (newPage >= 1 && newPage <= this.nbPages) {
            this.currentPage = newPage;
            this.changePageEmitter.emit(newPage)
        }
    }
}
