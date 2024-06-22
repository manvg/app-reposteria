import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { TortasComponent } from './components/tortas/tortas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  {path: 'index', component: IndexComponent},
  {path: 'tortas', component: TortasComponent}
];
