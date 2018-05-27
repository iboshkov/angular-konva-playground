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

  stuff = [1,2,3];

  fill = 'red';
  title = 'app';

  addStuff() {
    this.stuff.push(1);
  }

  /**
   *
   */
  constructor() {
  }
}
