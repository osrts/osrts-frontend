// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import {Subscription} from 'rxjs';
var swal = require('sweetalert2');
import * as moment from 'moment/moment';
declare var jQuery: any;
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UsersService]
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy  {

  loaded=false;

  // Subscription + data
  usersSubscription : Subscription;
  users = [];

  // Action for modal
  action="";
  // User to be modified
  emptyUser= {name: "", email: "", password: "", passwordConfirmation: ""};
  userToBeModified = {name: "", email: "", password: "", passwordConfirmation: ""};

  constructor(private _usersService: UsersService) {
  }

  ngOnInit(){
    this.usersSubscription = this._usersService.usersSubject.subscribe(users => {
      this.users = users;
      this.loaded=true;
    });
    this._usersService.find({});
  }

  ngAfterViewInit() {
      jQuery('.ui.modal-user').modal({closable: false});
  }

  // #######################
  // Modal related functions
  // #######################

  clickAdd(){
    jQuery('.ui.modal-user').modal('show');
    this.action='add';
  }

  clickModify(user){
    this.userToBeModified = Object.assign({}, user);
    jQuery('.ui.modal-user').modal('show');
    this.action='edit';
  }

  submitForm($event){
    if(this.checkPasswords()){
      delete this.userToBeModified['passwordConfirmation'];
      if(this.action=='add'){
        this._usersService.create(this.userToBeModified);
      } else {
        this._usersService.patch(this.userToBeModified);
      }
      this.clickCancel();
    } else {
      swal({
          title: 'Les mots de passe ne correspondent pas !',
          type: 'warning'
      });
    }
  }

  checkPasswords(){
    if(this.userToBeModified['password']){
      return this.userToBeModified['password'] == this.userToBeModified['passwordConfirmation'];
    } else {
      return true;
    }
  }

  remove(userId){
    swal({
        title: 'Êtes-vous sûr ?',
        text: "Cet admin sera totalement supprimé ! Il ne pourra plus se connecter.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Confirmer'
    }).then(()=> {
        this._usersService.remove(userId);
        swal(
            'Supprimé!',
            'Cet admin a été supprimé.',
            'success'
        )
    });
  }

  // Cancel in modal
  clickCancel(){
    jQuery('.ui.modal-user').modal('hide');
    this.userToBeModified = this.emptyUser;
    this.action='';
  }

  // #########
  // End modal
  // #########

  ngOnDestroy(){
    if(this.usersSubscription)
      this.usersSubscription.unsubscribe();
  }
}
