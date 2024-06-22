import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { TortasComponent } from './components/tortas/tortas.component';
import { CheesecakesComponent } from './components/cheesecakes/cheesecakes.component';
import { KuchensComponent } from './components/kuchens/kuchens.component';
import { TartaletasComponent } from './components/tartaletas/tartaletas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  {path: 'index', component: IndexComponent},
  {path: 'tortas', component: TortasComponent},
  {path: 'cheesecakes', component: CheesecakesComponent},
  {path: 'kuchens', component: KuchensComponent},
  {path: 'tartaletas', component: TartaletasComponent}
];
