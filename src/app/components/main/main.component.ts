import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dbSvc } from 'src/app/services/db.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private db: dbSvc, private router: Router) {}

  ngOnInit(): void {
    //check for api key
    this.db.hasKey().then((flag) => {
      if (flag) {
        this.router.navigate(['/countries']);
      } else {
        this.router.navigate(['/settings']);
      }
    });
  }
}
