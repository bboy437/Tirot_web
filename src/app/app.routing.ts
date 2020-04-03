import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/dashboard' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
