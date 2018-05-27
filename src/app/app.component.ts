import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {

  }

  radius = 100;

  fill = 'red';
  title = 'app';

  /**
   *
   */
  constructor() {
  }
}
