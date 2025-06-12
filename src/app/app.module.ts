import { NgModule } from '@angular/core';
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
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { SideCartComponent } from './components/side-cart/side-cart.component';
import { NavBarComponent } from './components/nav-bar-login-logout/nav-bar.component';
import { NavBarTabsComponent } from './components/nav-bar-tabs/nav-bar-tabs.component';
import { ShopComponent } from './components/shop/shop.component';
import { UserComponent } from './pages/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CheckoutComponent,
    ProductComponent,
    ProductDetailComponent,
    CartComponent,
    SideCartComponent,
    NavBarComponent,
    NavBarTabsComponent,
    ShopComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CurrencyPipe,
    provideHttpClient(
      withInterceptors([authInterceptor]),
    )
  ],
  exports:[RegisterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
