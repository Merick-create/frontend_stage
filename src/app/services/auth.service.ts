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
      const authTokens = this.jwtSrv.getToken();
      if (!authTokens) {
          this.logout();
          return;
      }
      
      // If tokens exist but are expired, try to refresh
      if (!this.jwtSrv.areTokensValid()) {
          this.refresh().subscribe({
              error: () => this.logout()
          });
      } else {
          const user = this.jwtSrv.getPayload<User>();
          this._currentUser$.next(user);
      }
  }

  login(username: string, password: string) {
    return this.http.post<any>('/api/login', {username, password})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token, res.refreshToken)),
        tap(res => this._currentUser$.next(res.user)),
        map(res => res.user)
      );
  }

  refresh() {
    const authTokens = this.jwtSrv.getToken();
    if (!authTokens) {
      throw new Error('Missing refresh token');
    }
    return this.http.post<{token: string, refreshToken: string}>('/api/refresh', {refreshToken: authTokens.refreshToken})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token, res.refreshToken)),
        tap(_ => {
          const user = this.jwtSrv.getPayload<User>();
          this._currentUser$.next(user);
        })
      );
  }

  fetchUser() {
    return this.http.get<User>('/api/users/me')
      .pipe(
        catchError(_ => {
          return of(null);
        }),
        tap(user => this._currentUser$.next(user))
      );
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/login']);
    
  }
  add(newUser:AuthService){
    return this.http.post<any>('/api/register',newUser);
  }

  updateUserPicture(newUrl: string) {
  return this.http.patch<User>('/api/users/me', { picture: newUrl })
    .pipe(
      tap(user => this._currentUser$.next(user)), // aggiorna il ReplaySubject
      catchError(err => {
        console.error('Errore aggiornamento immagine:', err);
        return of(null);
      })
    );
}



}