import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar-tabs',
  standalone: false,
  templateUrl: './nav-bar-tabs.component.html',
  styleUrl: './nav-bar-tabs.component.css'
})
export class NavBarTabsComponent {
  navItems = [
    { label: 'Home Page', route: '/' },
    { label: 'Cart', route: '/cart' },
    { label: 'Checkout', route: '/checkout' },

  ];
}
