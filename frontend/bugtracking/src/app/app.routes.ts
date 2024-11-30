import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllUsersComponent } from './component/all-users/all-users.component';
import { AssignTicketComponent } from './component/assign-ticket/assign-ticket.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { MyTicketsComponent } from './component/my-tickets/my-tickets.component';
import { PasswordComponent } from './component/password/password.component';
import { ProfileComponent } from './component/profile/profile.component';
import { TicketsComponent } from './component/tickets/tickets.component';
import { UserSigninComponent } from './component/user-signin/user-signin.component';
import { EditTicketComponent } from './component/edit-ticket/edit-ticket.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: UserSigninComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'all-users', component: AllUsersComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'my-tickets', component: MyTicketsComponent },
      { path: 'change-password', component: PasswordComponent },
      { path: 'tickets/assign-ticket', component: AssignTicketComponent },
      { path: 'tickets/edit-ticket', component: EditTicketComponent },
      { path: '**', redirectTo: '/profile' },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
