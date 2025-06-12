import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  protected LoginSrv = inject(AuthService);

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
    map(user => user?.picture ?? 'assets/default-avatar.png')
  );


  protected newImageUrl: string = '';

  changeImg() {
    if (this.newImageUrl) {
      this.LoginSrv.updateUserProfilePicture(this.newImageUrl).subscribe({
        next: (updatedUser) => {
          console.log('Immagine aggiornata con successo:', updatedUser);
          this.newImageUrl = '';
        },
        error: (err) => {
          console.error('Errore durante l\'aggiornamento dell\'immagine:', err);
          alert('Impossibile aggiornare l\'immagine. Controlla l\'URL o riprova.');
        }
      });
    } else {
      alert('Per favore, inserisci un nuovo URL per l\'immagine.');
    }
  }
}