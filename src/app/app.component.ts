import { Component, ViewEncapsulation } from '@angular/core';
import { Title }  from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  template: `
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Game of Trails - résultats");
  }
}

  // <div class="page-wrapper">
  //   <div class="dimmed-background">
  //     <router-outlet></router-outlet>
  //   </div>
  // </div>
