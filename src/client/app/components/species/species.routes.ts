import { SpeciesListPageComponent } from './species-list-page.component';
import { SpeciesFormPageComponent } from './species-form-page.component';
import { SpeciesImportPageComponent } from './species-import-page.component';
import { ViewSpeciesPageComponent } from './view-species-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const SpeciesRoutes: Array<any> = [
  {
    path: 'species',
    component: SpeciesListPageComponent,
    canActivate : [AuthGuard]
  }, {
    path: 'speciesForm',
    component: SpeciesFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'speciesForm/:id',
    component: SpeciesFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'speciesImport',
    component: SpeciesImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'species/:id',
    component: ViewSpeciesPageComponent,
    canActivate : [AuthGuard]
  }
]