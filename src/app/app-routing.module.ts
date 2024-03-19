import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponentComponent } from './file-upload-component/file-upload-component.component';

const routes: Routes = [
  { path: 'file-upload', component: FileUploadComponentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
