import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone:false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  protected LoginSrv = inject(AuthService);

  // Input dell'utente per l'URL dell'immagine
  newImageUrl: string = '';

  // Osservabili per mostrare i dati utente
  protected firstName$ = this.LoginSrv.currentUser$.pipe(
    map(user => user?.firstName ?? '')
  );

  protected lastName$ = this.LoginSrv.currentUser$.pipe(
    map(user => user?.lastName ?? '')
  );

  protected role$ = this.LoginSrv.currentUser$.pipe(
    map(user => user?.role ?? '')
  );

  protected img$ = this.LoginSrv.currentUser$.pipe(
    map(user => user?.picture ?? '')
  );

  // Cambia immagine chiamando il backend
  changeImg() {
    if (this.newImageUrl.trim()) {
      this.LoginSrv.updateUserPicture(this.newImageUrl).subscribe({
        next: () => {
          this.LoginSrv.fetchUser();
          this.newImageUrl = '';
        },
        error: (err) => console.error('Errore durante l\'aggiornamento dell\'immagine:', err)
      });
    }
  }
}
