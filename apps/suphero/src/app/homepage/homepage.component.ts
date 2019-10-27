import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Message} from '@supcode-mono/api-interfaces';
import {Observable} from 'rxjs';

@Component({
  selector: 'sup-hero-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  hello$: Observable<Message>;


  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.hello$ = this.http.get<Message>('/api/hello');
  }

}
