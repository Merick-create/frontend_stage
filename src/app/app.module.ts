import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/auth.interceptor';
import { CheckoutComponent } from './pages/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'it-IT' },
    CurrencyPipe,
    provideHttpClient(
      withInterceptors([authInterceptor]),
    )
  ],
  exports:[RegisterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
