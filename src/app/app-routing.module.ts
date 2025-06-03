import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductComponent } from './components/product/product.component';

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
    path:'product',
    component:ProductComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
