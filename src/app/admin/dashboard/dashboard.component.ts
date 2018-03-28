// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BrowserXhr, Http } from '@angular/http';
import { RaceService } from '../../services/race/race.service';
import { WavesService } from '../../services/waves/waves.service';
import { ExcelParserService } from '../../services/runners/excel-parser.service';
import { TimesParserService } from '../../services/times/times-parser.service';
import { Subscription } from 'rxjs/Subscription';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { saveAs } from 'file-saver';

const request = require('superagent');
const swal = require('sweetalert2');
import * as moment from 'moment/moment';
import 'moment/locale/fr';
moment.locale('fr');
declare var jQuery: any;

// #####################################
// Controller of the Dashboard component
// #####################################

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [RaceService, WavesService, ExcelParserService, TimesParserService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  // Race
  race: any;
  raceSubscription: Subscription;
  now: any;
  days = [];

  // Waves
  wavesSubscription: Subscription;

  // Chart for the runners
  pieChartRunnersLabels: string[] = [];
  pieChartRunnersData: number[] = [];
  pieChartType = 'pie';
  pieChartOptions: any = { responsive: true };

  // Boolean indicating if the tags have been assigned
  tagsAssigned = false;

  // Bar chart for the waves
  barChartWavesLabels: string[] = [];
  barChartWavesData: any[] = [
    { data: [], label: '' }
  ];
  barChartType = 'bar';
  barChartLegend = true;
  barChartOptions: any = { responsive: true, scales: { yAxes: [{ ticks: { beginAtZero: true } }] } };
  wavesLaunched = false;

  // Pdf Generation
  generatingPdf = false;
  generatingExcel = false;

  // Constructor
  constructor(private _raceService: RaceService,
    private _wavesService: WavesService,
    private _excelParserService: ExcelParserService,
    private _timesParserService: TimesParserService,
    private http: Http) {
    this.now = moment();
  }

  // Called at the initialization
  ngOnInit() {
    this.raceSubscription = this._raceService.raceSubject.subscribe((data) => {
      if (!data) {
        this.race = {};
        return;
      }
      this.race = data;
      this.pieChartRunnersLabels = [];
      this.pieChartRunnersData = [];
      this.days = [];
      this.race.from = moment(data.from, 'DD-MM-YYYY');
      this.race.to = moment(data.to, 'DD-MM-YYYY');
      const dateTraveler = moment(this.race.from);
      while (dateTraveler.isSameOrBefore(this.race.to)) {
        if (this.race['counts']) {
          this.pieChartRunnersLabels.push(dateTraveler.format('dddd'));
          this.pieChartRunnersData.push(this.race.counts[dateTraveler.format('DD-MM-YYYY')]);
        }
        this.days.push({
          dayOfWeek: dateTraveler.format('dddd'),
          date: dateTraveler.format('DD-MM')
        });
        dateTraveler.add(1, 'days');
      }
      if (this.race.tagsAssigned) {
        this.tagsAssigned = true;
      }
    });
    this._raceService.get();
    this.findWaves();

  }

  // function exclusively used to find the waves
  findWaves() {
    this._wavesService.findWithPromise({ query: { $sort: { date: 1, num: 1, type: 1 } } }).then(data => {
      const setDates = new Set();
      const arrayLabels = [];
      const arrayData = [];
      let index = -1;
      data.data.forEach(wave => {
        if (wave['start_time']) {
          this.wavesLaunched = true;
        }
        if (arrayLabels.indexOf(wave.type + '(' + wave.num + ')') === -1) {
          arrayLabels.push(wave.type + '(' + wave.num + ')');
        }
        const posOfWave = arrayLabels.indexOf(wave.type + '(' + wave.num + ')');
        if (!setDates.has(wave.date)) {
          setDates.add(wave.date);
          arrayData.push({ data: [], label: wave.date });
          index++;
        }
        if (arrayData[index].data.length < posOfWave) {
          arrayData[index].data = arrayData[index].data.concat(new Array(posOfWave - arrayData[index].data.length));
        }
        arrayData[index].data[posOfWave] = wave.count;
      });
      this.barChartWavesData = arrayData;
      this.barChartWavesLabels = arrayLabels;
    });
  }

  /*
  Function that allows to import an excel containing all the runners
  */
  importRunners() {
    swal({
      title: 'Choisissez le fichier',
      html: '<div class="ui progress green start-hidden" id="progress-process">' +
        '<div class="bar">' +
        '<div class="progress"></div>' +
        '</div>' +
        '<div class="label">Traitement des données...</div>' +
        '</div>',
      input: 'file',
      inputAttributes: {
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: (file) => {
        const self = this;
        return new Promise(function (resolve, reject) {
          jQuery('#progress-process').removeClass('start-hidden');
          jQuery('#progress-process').progress();
          const subscribe = self._excelParserService.statusSubject.subscribe((status) => {
            jQuery('#progress-process').progress('set progress', status.step);
            if (status.step === status.nbSteps) {
              resolve();
            }
          }, (err) => { console.log('err', err); });
          self._excelParserService.parseExcel(file).then((result, error) => {
            console.log(result);
            if (!result || result.status !== 'success') {
              console.log(error);
              reject(error);
              swal({
                type: 'error',
                title: 'Une erreur est survenue lors de votre requête !'
              });
            } else {
              jQuery('#progress-process').progress('set total', result.nbSteps);
            }
          });
        });
      }
    }).then(() => {
      this.findWaves();
      swal({
        type: 'success',
        title: 'Données sauvegardées !'
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  /*
  Function that allows to import an excel containing all the runners
  */
  importTimes() {
    swal({
      title: 'Choisissez le fichier',
      html: '<div class="ui progress green start-hidden" id="progress-process">' +
        '<div class="bar">' +
        '<div class="progress"></div>' +
        '</div>' +
        '<div class="label">Traitement des données...</div>' +
        '</div>',
      input: 'file',
      inputAttributes: {
        accept: '.csv'
      },
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: (file) => {
        const self = this;
        return new Promise(function (resolve, reject) {
          jQuery('#progress-process').removeClass('start-hidden');
          jQuery('#progress-process').progress();
          const subscribe = self._timesParserService.statusSubject.subscribe((status) => {
            jQuery('#progress-process').progress('set progress', status.step);
            if (status.step === status.nbSteps) {
              resolve();
            }
          }, (err) => { });
          self._timesParserService.parseTxt(file).then((result, error) => {
            if (!result || result.status !== 'success') {
              reject(error);
              swal({
                type: 'error',
                title: 'Une erreur est survenue lors de votre requête !'
              });
            } else {
              jQuery('#progress-process').progress('set total', result.nbSteps);
            }
          });
        });
      }
    }).then(() => {
      this.findWaves();
      swal({
        type: 'success',
        title: 'Données sauvegardées !'
      });
    }).catch((error) => {
      console.log(error);
    });
  }


  /*
  Function that allows to generate a PDF of all the runners
  */
  generatePDF() {
    this.generatingPdf = true;
    let url = '';
    if (document.location.hostname === 'localhost') {
      url = 'http://localhost:3030/generator-runners-pdf';
    } else {
      url = document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '/generator-runners-pdf';
    }

    // See http://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status === 200) {
        const filename = 'waves';
        const type = xhr.getResponseHeader('Content-Type');

        const blob = new Blob([xhr.response], { type: type });
        saveAs(blob, filename);
      }
      this.generatingPdf = false;
    };
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authentification', window.localStorage['feathers-jwt']);
    xhr.send();
  }

  generateExcel() {
    this.generatingExcel = true;
    let url = '';
    if (document.location.hostname === 'localhost') {
      url = 'http://localhost:3030/generator-runners-excel';
    } else {
      url = document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '/generator-runners-excel';
    }

    // See http://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status === 200) {
        const filename = 'waves';
        const type = xhr.getResponseHeader('Content-Type');

        const blob = new Blob([xhr.response], { type: type });
        saveAs(blob, filename);
      }
      this.generatingPdf = false;
    };
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authentification', window.localStorage['feathers-jwt']);
    xhr.send();
  }

  ngOnDestroy() {
    if (this.raceSubscription) {
      this.raceSubscription.unsubscribe();
    }
  }
}
