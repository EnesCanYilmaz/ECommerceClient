import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { List_Product_Image } from 'src/app/contracts/products/list_product_image';
import { DialogService } from 'src/app/services/common/dialog.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { BaseDialog } from '../base/base-dialog';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';
import { HttpClient } from '@angular/common/http';

declare var $: any

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss']
})
export class SelectProductImageDialogComponent extends BaseDialog<SelectProductImageDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectProductİmageState | string,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) {
    super(dialogRef);
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: ".png, .jpg, .jpeg, .gif",
    controller: "products",
    action: "upload",
    isAdminPage: true,
    explanation: "Select or drag product image here",
    queryString: `id=${this.data}`
  }

  images: List_Product_Image[];

  async ngOnInit(): Promise<void> {
    await this.getImages(this.data as string);
  }
  
  async getImages(id: string): Promise<void> {
    this.images = await this.productService.readImages(id);
  }
  
  async deleteImage(imageId: string, event: any) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.Pacman)
        await this.productService.deleteImage(this.data as string, imageId, () => {
          this.spinner.hide(SpinnerType.Pacman);
          var card = $(event.srcElement).parents('.product-image-card');
          card.fadeOut(500, () => card.remove());
        });
      }
    })
  }
}
export enum SelectProductİmageState {
  Close
}
