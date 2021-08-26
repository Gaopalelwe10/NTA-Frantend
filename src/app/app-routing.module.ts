import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { TabsPage } from './pages/tabs/tabs.page';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  {
    // path:'menu',
    // component: CalenderPage,children:[
     
    // ]
    
      path: 'tabs',
      component: TabsPage, canActivate: [AuthGuard] ,children: [
        {
          path: '',
          loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
        },
        {
          path: 'home',
          loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
        },
        {
          path: 'profile',
          loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
        },
        {
          path: 'tickets',
          loadChildren: () => import('./pages/tickets/tickets.module').then( m => m.TicketsPageModule)
        },
    ]
    
  },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./pages/tickets/tickets.module').then( m => m.TicketsPageModule)
  },
  {
    path: 'charges',
    loadChildren: () => import('./pages/charges/charges.module').then( m => m.ChargesPageModule)
  },
  {
    path: 'changepassword',
    loadChildren: () => import('./pages/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  },
  {
    path: 'ticket-form',
    loadChildren: () => import('./pages/ticket-form/ticket-form.module').then( m => m.TicketFormPageModule)
  },
  {
    path: 'vehicletype',
    loadChildren: () => import('./pages/vehicletype/vehicletype.module').then( m => m.VehicletypePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
