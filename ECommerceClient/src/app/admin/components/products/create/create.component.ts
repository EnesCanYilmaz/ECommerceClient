import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/products/create_product';
import { AlertifyMessageType, AlertifyPosition, AlertifyService } from 'src/app/services/admin/alertify.service';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent extends BaseComponent implements OnInit {

  constructor(spinner : NgxSpinnerService, private productService : ProductService,private alertifyService: AlertifyService) { 
    super(spinner)
  }
  ngOnInit(): void {}
  
  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();

  create(name: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement) {
    this.showSpinner(SpinnerType.Pacman);
    const create_product: Create_Product = new Create_Product();
    create_product.name = name.value;
    create_product.stock = parseInt(stock.value);
    create_product.price = parseFloat(price.value);

    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.Pacman);
      this.alertifyService.message("Product added successfully.", {
        messageType: AlertifyMessageType.Success,
        position: AlertifyPosition.TopRight,
        delay : 1500
      });
      this.createdProduct.emit(create_product);
    }, errorMessage => {
      this.alertifyService.message(errorMessage,
        {
          dismissOthers: true,
          messageType: AlertifyMessageType.Error,
          position: AlertifyPosition.TopRight
        });
    });
  }
}
