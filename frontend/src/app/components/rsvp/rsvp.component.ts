import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FetchService } from 'src/app/fetch.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css'],
})
export class RsvpComponent implements OnInit {
  constructor(private backend: FetchService) {}

  res: any[];

  ngOnInit(): void {
    this.backend.getRsvp().then((res) => (this.res = res));
  }
}
