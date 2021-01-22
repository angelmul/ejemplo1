import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarAlumnoPage } from './editar-alumno-page.page';

const routes: Routes = [
  {
    path: '',
    component: EditarAlumnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarAlumnoPagePageRoutingModule {}
