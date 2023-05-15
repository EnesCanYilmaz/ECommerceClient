import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from './components/components.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    ComponentsModule
  ],exports:[
    LayoutModule,
  ]
})
export class AdminModule { }
