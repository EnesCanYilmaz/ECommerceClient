import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { FileUploadDialogComponent, FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { AlertifyMessageType, AlertifyPosition, AlertifyService } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { DialogService } from '../dialog.service';
import { HttpClientService } from '../http-client.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private toastrService: CustomToastrService,
    private dialogService: DialogService,
    private spinner : NgxSpinnerService
  ) {
  }
  @Input() options: Partial<FileUploadOptions>;

  public files: NgxFileDropEntry[];

  public selectedFiles(files: NgxFileDropEntry[]) {

    const fileData: FormData = new FormData();

    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath)
      });
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.SquareJellyBox)
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ "responseType": "blob" })
        }, fileData).subscribe(data => {
          const successMessage: string = "Dosyalarınız başarıyla yüklenmiştir";
          this.spinner.hide(SpinnerType.SquareJellyBox)
          if (this.options.isAdminPage) {
            this.alertifyService.message(successMessage, {
              dismissOthers: true,
              messageType: AlertifyMessageType.Success,
              position: AlertifyPosition.BottomRight
            })
          }
          else {
            this.toastrService.message(successMessage, "Başarılı", {
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.BottomRight,
            })
          }
          
        }, (errorResponse: HttpErrorResponse) => {
          const failMessage: string = "Hatayla karşılaştınız";
          if (!this.options.isAdminPage) {
            this.alertifyService.message(failMessage, {
              dismissOthers: true,
              messageType: AlertifyMessageType.Error,
              position: AlertifyPosition.BottomRight
            });
          }
          else {
            this.toastrService.message(failMessage, "Başarısız", {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.BottomRight,
            })
          }
        })
      }
    })
  }

}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage: boolean = false;
}
