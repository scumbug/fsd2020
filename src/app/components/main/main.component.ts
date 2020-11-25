import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  options: AnimationOptions = {
    path: '/assets/ani.json',
  };

  constructor(private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {}

  goToList() {
    this.ngZone.run(() => {
      this.router.navigate(['/searchlist']);
    });
  }
}
