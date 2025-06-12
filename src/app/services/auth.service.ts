// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, distinctUntilChanged, map, of, ReplaySubject, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { User } from '../entities/User'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);

  protected _currentUser$ = new ReplaySubject<User | null>(1);
  currentUser$ = this._currentUser$.asObservable();

  isAuthenticated$ = this.currentUser$
                        .pipe(
                          map(user => !!user),
                          distinctUntilChanged()
                        );

  constructor() {
    this.loadCurrentUserOnStartup(); 
  }

  private loadCurrentUserOnStartup() {
    const authTokens = this.jwtSrv.getToken();
    if (!authTokens) {
        this.logout();
        return;
    }
    
    if (!this.jwtSrv.areTokensValid()) {
        
        this.refresh().subscribe({
            next: () => {
                
                this.fetchUser().subscribe(); 
            },
            error: () => this.logout() 
        });
    } else {
        
        this.fetchUser().subscribe({
          error: () => this.logout()
        }); 
    }
  }

  login(username: string, password: string) {
    return this.http.post<any>('/api/login', {username, password})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token, res.refreshToken)),
        tap(res => {

          this.fetchUser().subscribe();
        }),
        map(res => res.user)
      );
  }

  refresh() {
    const authTokens = this.jwtSrv.getToken(); 
    if (!authTokens || !authTokens.refreshToken) {
      throw new Error('Missing refresh token'); 
    }
    return this.http.post<{token: string, refreshToken: string}>('/api/refresh', {refreshToken: authTokens.refreshToken}) 
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token, res.refreshToken)),
        tap(_ => {

        })
      );
  }

  fetchUser() {
    
    return this.http.get<User>('/api/users/me')
      .pipe(
        tap(user => {
          if (user) {
            this._currentUser$.next(user);
          } else {
            this.logout(); 
          }
        }),
        catchError(_ => {

          console.error('Errore durante il recupero dei dati utente, disconnessione...');
          this.logout();
          return of(null);
        })
      );
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  add(newUser: any){ 
    return this.http.post<any>('/api/register', newUser);
  }

  updateUserProfilePicture(newPictureUrl: string) {
    return this.http.patch<User>('/api/users/me', { picture: newPictureUrl })
      .pipe(
        tap(updatedUser => {

          this._currentUser$.next(updatedUser); 
        }),
        catchError((err) => {
          console.error('Errore durante l\'aggiornamento dell\'immagine utente nel backend:', err);
          throw err; 
        })
      );
  }
}