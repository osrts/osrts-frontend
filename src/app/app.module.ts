// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';

import { SocketService } from './services/feathers.service';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AdminModule }   from './admin/admin.module';
import { AuthGuard } from './services/auth/auth-guard';
import { UnauthGuard } from './services/auth/unauth-guard';
import { TableComponent } from './components/table/table.component';
import { DayChooserComponent } from './components/day-chooser/day-chooser.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ResultsComponent,
        PageNotFoundComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: 'results/:date', component: ResultsComponent },
            { path: 'login', component: LoginComponent, canActivate: [UnauthGuard]},
            { path: 'admin', loadChildren: './admin/admin.module#AdminModule' , canActivate: [AuthGuard] },//() => AdminModule
            { path: '**', component: PageNotFoundComponent }
        ], { useHash: true })
    ],
    providers: [SocketService, AuthGuard, UnauthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
