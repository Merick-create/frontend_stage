import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { authGuard } from './utils/auth.guard';
import { ShopComponent } from './components/shop/shop.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  {
    path: 'login',
    component:LoginComponent,
  },
  {
    path: 'register',
    component:RegisterComponent,
  },
  {
    path: 'checkout',
    component:CheckoutComponent,
    canActivate:[authGuard]
  },
  {
    path:'',
    component:ProductComponent,
  },
  {
    path:'details/:id',component:ProductDetailComponent
  },
  {
    path:"cart",
    component:CartComponent
  },
  {
    path:"shop",
    component:ShopComponent
  },
  {
    path:"user",
    component:UserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
