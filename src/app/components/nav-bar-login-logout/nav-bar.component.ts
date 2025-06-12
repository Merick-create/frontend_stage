import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  protected LoginSrv=inject(AuthService)
  protected router=inject(Router)
  
  protected firstName$ = this.LoginSrv.currentUser$.pipe(
    map(user => user?.firstName ?? '')
  );
  
  protected lastName$ = this.LoginSrv.currentUser$.pipe(
    map(user => user?.lastName ?? '')
  );

  protected img$=this.LoginSrv.currentUser$.pipe(
    map(user=>user?.picture ?? '')
  )
  

  login(){
    this.router.navigate([`/login`])
  }
  logout(){
    this.LoginSrv.logout()
  }

  goToUser(){
    this.router.navigate([`/user`])
  }
}
