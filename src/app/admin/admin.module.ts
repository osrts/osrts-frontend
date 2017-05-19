import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { RacesComponent } from './races/races.component';
import { CheckpointsComponent } from './checkpoints/checkpoints.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WavesManagementComponent } from './waves/management/waves-management.component';
import { ModalWaveComponent } from './waves/management/modal-wave/modal-wave.component';
import { WavesLauncherComponent } from './waves/launcher/waves-launcher.component';
import { RunnersComponent } from './runners/runners.component';
import { TagsComponent } from './tags/tags.component';
import { TimesComponent } from './times/times.component';
import { ResultsComponent } from './results/results.component';
import { TableComponent } from '../components/table/table.component'
import { DayChooserComponent } from '../components/day-chooser/day-chooser.component';
import { PaginationComponent } from '../components/pagination/pagination.component';

const routes: Routes = [
    { path: '', component: AdminComponent, children: [
            {path: '', component: DashboardComponent, pathMatch: 'full'},
            {path: 'races', component: RacesComponent},
            {path: 'dashboard', component: DashboardComponent},
            {path: 'waves-management', component: WavesManagementComponent},
            {path: 'waves-launcher', component: WavesLauncherComponent},
            {path: 'checkpoints', component: CheckpointsComponent},
            {path: 'runners', component: RunnersComponent},
            {path: 'tags', component: TagsComponent},
            {path: 'times', component: TimesComponent},
            {path: 'results', component: ResultsComponent}
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), FormsModule, MomentModule, ChartsModule],
    declarations: [
      AdminComponent,
      RacesComponent,
      CheckpointsComponent,
      DashboardComponent,
      WavesManagementComponent,
      ModalWaveComponent,
      WavesLauncherComponent,
      RunnersComponent,
      TagsComponent,
      TimesComponent,
      ResultsComponent,
      TableComponent,
      DayChooserComponent,
      PaginationComponent,
    ],
    // exports: [RouterModule]
})
export class AdminModule {}
