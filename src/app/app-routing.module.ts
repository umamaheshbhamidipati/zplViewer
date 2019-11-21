import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NestedFormComponent } from './components/nested-form/nested-form.component';


const routes: Routes = [
  { path: '', component: NestedFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
