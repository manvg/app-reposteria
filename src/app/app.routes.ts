import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { TortasComponent } from './components/tortas/tortas.component';
import { CheesecakesComponent } from './components/cheesecakes/cheesecakes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  {path: 'index', component: IndexComponent},
  {path: 'tortas', component: TortasComponent},
  {path: 'cheesecakes', component: CheesecakesComponent}
];
