// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/feathers.service';

var swal = require('sweetalert2');
declare var jQuery:any;

@Component({
  selector: 'app-admin',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit {

  constructor(private socketService: SocketService, private router: Router) { }

  showMobileMenu(){
    jQuery('#mobile-menu').show();
  }

  hideMobileMenu(){
    jQuery('#mobile-menu').hide();
  }

  ngAfterViewInit(){
    jQuery('.dropdown-menu').dropdown({
      on: 'hover',
      action: 'hide'
    });
    jQuery('.accordion-mobile').accordion();
    jQuery('#mobile-menu').hide();
  }
}
