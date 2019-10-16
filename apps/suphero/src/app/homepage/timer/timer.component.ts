import { Component, OnInit } from '@angular/core';
import {TimerQuery} from './state/timer.query';
import {TimerService} from './state/timer.service';

@Component({
  selector: 'sup-hero-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  constructor(public query: TimerQuery, private service: TimerService) { }

  ngOnInit() {
    this.service.receiveTimerUpdates();
    this.service.receiveViews();
  }

}
