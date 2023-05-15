import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List_Product } from 'src/app/contracts/products/list_product';
import { SelectProductImageDialogComponent } from 'src/app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';
declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  constructor(private productService: ProductService, private dialogService: DialogService, private activatedRoute: ActivatedRoute) { }


  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 5;
  pageList: number[] = [];

  products: List_Product[];
  async ngOnInit() {
    this.getProducts()
  }

  
  getProducts() {
    this.activatedRoute.params.subscribe(async params => {
      this.currentPageNo = parseInt(params["pageNo"] ?? 1)
      const data: { totalProductCount: number, products: List_Product[] } =
        await this.productService.list(this.currentPageNo - 1, this.pageSize, () => {

        },
          errorMessage => {

          });
          
      this.products = data.products;
      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(parseFloat(this.totalProductCount.toString()) / parseFloat(this.pageSize.toString()));

      this.pageList = [];
      if (this.currentPageNo - 3 <= 0)
        for (let i = 1; i <= 7; i++)
          this.pageList.push(i);


      else if (this.currentPageNo + 3 >= this.totalPageCount)
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++)
          this.pageList.push(i);

      else
        for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++)
          this.pageList.push(i);
    })
  }
  addProductImages(id: string) {
    this.dialogService.openDialog({
      componentType: SelectProductImageDialogComponent,
      data: id,
      options: {
        width: "1400px"
      }
    });
  }
}
