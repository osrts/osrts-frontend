import { Component, OnInit, OnDestroy} from '@angular/core';
import { CheckpointsService } from '../../services/checkpoints/checkpoints.service';
import { RaceService } from '../../services/race/race.service';
import { TimesService } from '../../services/times/times.service';
import {Subject} from 'rxjs';
import {Subscription} from 'rxjs';
declare var jQuery: any;
import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');
var swal = require('sweetalert2');

@Component({
    selector: 'app-points',
    templateUrl: './checkpoints.component.html',
    styleUrls: ['./checkpoints.component.css'],
    providers: [CheckpointsService, RaceService, TimesService]
})

export class CheckpointsComponent implements OnInit, OnDestroy {
    loaded = false;
    checkpointToBeModified: any;
    checkpointSubscription: Subscription;
    checkpoints = [];
    modalTimes: any = {};
    raceSubscription: Subscription;
    colors = [];
    constructor(
        private _checkpointsService: CheckpointsService,
        private _raceService: RaceService,
        private _timesService: TimesService
    ) {
        this._checkpointsService = _checkpointsService;
        this.checkpointToBeModified = {};
    }

    ngOnInit() {
        console.log("ngOnInint");
        this.checkpointSubscription = this._checkpointsService.checkpointsSubject.subscribe((data) => {
            this.checkpoints = data.checkpoints;
            this.loaded = true;
        });
        this.raceSubscription = this._raceService.raceSubject.subscribe((data) => {
            this.colors = data.tagsColor;
            console.log(this.colors)
        });
        this._raceService.get();
        this.find();
    }

    ngOnDestroy() {
        this.checkpointSubscription.unsubscribe();
    }

    find() {
        this._checkpointsService.find({query: {$sort: {num: 1}}});
    }

    ngAfterViewInit() {
        jQuery('.ui.modal-checkpoint').modal({ closable: false });
    }

    remove(key: string) {
        swal({
            title: 'Êtes-vous sûr ?',
            text: "Les données ne pourront plus être récupérées!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Confirmer'
        }).then(() => {
            this._checkpointsService.remove(key);
            swal(
                'Supprimé!',
                'Le checkpoint a été supprimé.',
                'success'
            )
        });
    }

    // Function called when a change is detected at a checkbox. It updates in the database the data
    changeCheckbox(checkpoint) {
        checkpoint.used = !checkpoint.used;
        this._checkpointsService.update(checkpoint)
    }

    // Function that opens the modal for modifying a checkpoint
    openModal(checkpoint) {
        Object.assign(this.checkpointToBeModified, checkpoint)
        // this.checkpointToBeModified = checkpoint;
        jQuery('.ui.modal-checkpoint').modal('show');
    }

    // Function that closes the modal
    closeModal() {
        jQuery('.ui.modal').modal('hide');
        this.checkpointToBeModified = {};
    }

    // Function that submits the data and save it in the database
    submitForm() {
        this._checkpointsService.update(this.checkpointToBeModified)
        this.closeModal();
    }

    // Function that opens the modal for adding a time
    openModalTimes(checkpoint) {
        this.modalTimes.checkpoint = checkpoint;
        jQuery('.ui.modal-times').modal('show');
        var now = moment().format('H:mm:ss');
        this.modalTimes.time = now;
    }

    insertTime() {
        console.log("Insert time")
        console.log(this.modalTimes)
        var time = moment();
        time.hour(this.modalTimes.time.split(':')[0])
        time.minute(this.modalTimes.time.split(':')[1])
        time.second(this.modalTimes.time.split(':')[2])

        this._timesService.create({
            timestamp: time.toISOString(),
            checkpoint_id: this.modalTimes.checkpoint.num,
            tag: {
                num: this.modalTimes.runner,
                color: this.modalTimes.color
            }
        }).then((data)=>{
            console.log("Succes")
            this.modalTimes = {};
        }).catch((err)=>{
            swal(err.message,"", 'error')
        });
    }

    displayConfiguration(c) {
        swal({
            title: 'Configuration',
            html:
            '<div class="configuration">' +
            '[Checkpoint]<br>' +
            'num = ' + c.num + '<br>' +
            'id = ' + c._id + '<br>' +
            '' + '<br>' +
            '[Database]' + '<br>' +
            'email = ' + '<br>' +
            'password = ' + '<br>' +
            'url = ' +
            '</div>',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText:
            'OK'
        }).catch(() => { })
    }
    // Function that opens the modal for adding a checkpoint
    addCheckpoint() {
        swal.setDefaults({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            animation: false,
            progressSteps: ['1', '2']
        })

        var steps = [
            'N° du checkpoint',
            'Nom du checkpoint'
        ]

        swal.queue(steps).then((result) => {
            var num = result[0];
            var title = result[1];
            if (isNaN(num)) {
                swal.resetDefaults()
                swal("Le numéro n'est pas correct", "", 'error')
            } else {
                this._checkpointsService.create({ num: num, title: title });
                swal.resetDefaults()
            }
        }, () => {
            swal.resetDefaults()
        })
    }
}
