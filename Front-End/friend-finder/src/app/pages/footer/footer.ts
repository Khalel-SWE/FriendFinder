import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIf],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  isLoggedIn = false;
  private router = inject(Router);

  ngOnInit() {
    this.checkAuthStatus();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.checkAuthStatus();
    });
  }

  checkAuthStatus() {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
  }
}