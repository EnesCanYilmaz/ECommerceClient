import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { DeleteDirective } from 'src/app/directives/admin/delete.directive';



@NgModule({
  declarations: [
    ProductsComponent,
    ListComponent,
    CreateComponent,
    DeleteDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: ProductsComponent }
    ]),
    DialogModule,
    FileUploadModule
  ]
})
export class ProductsModule { }
