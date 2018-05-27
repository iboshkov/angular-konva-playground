import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {

  }

  stuff = [1,2,3];

  title = 'app';

  /**
   *
   */
  constructor() {
  }
}
