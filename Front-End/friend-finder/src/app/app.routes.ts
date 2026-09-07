import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth';
import { Home } from './pages/home/home'; 
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { HomeFeed } from './pages/home-feed/home-feed';
import { ProfilePage } from './pages/profile-page/profile-page';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { Contact } from './pages/contact/contact';
import { MyMessages } from './pages/my-messages/my-messages';
import { AdminLayout } from './pages/admin-layout/admin-layout';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminUsers } from './pages/admin-users/admin-users';
import { AdminPosts } from './pages/admin-posts/admin-posts';
import { AdminContacts } from './pages/admin-contacts/admin-contacts';

export const routes: Routes = [
  
  { path: '', component: Home, canActivate: [noAuthGuard] },
  
  { path: 'feed', component: HomeFeed, canActivate: [authGuard] },
  
  { path: 'profile', component: ProfilePage, canActivate: [authGuard]},

  { path: 'profile/:id', component: ProfilePage, canActivate: [authGuard]},
  { path: 'edit-profile', component: EditProfile, canActivate: [authGuard] },
  
  { path: 'login', component: Login, canActivate: [noAuthGuard]},
  { path: 'register', component: Register, canActivate: [noAuthGuard]},
  { path: 'contact', component: Contact, canActivate: [authGuard]},
  { path:'my-messages', component:MyMessages, canActivate:[authGuard]},
  
  { path: 'admin', component: AdminLayout, canActivate: [authGuard], children: [
    { path: 'dashboard', component: AdminDashboard}, 
    { path: 'users', component: AdminUsers},
    { path: 'posts', component: AdminPosts},
    { path: 'contacts', component: AdminContacts},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
  ]},

  { path: '**', redirectTo: '' }
];