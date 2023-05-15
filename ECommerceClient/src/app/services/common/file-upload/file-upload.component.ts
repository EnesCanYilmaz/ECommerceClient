import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { FileUploadDialogComponent, FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { AlertifyMessageType, AlertifyPosition, AlertifyService } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { DialogService } from '../dialog.service';
import { HttpClientService } from '../http-client.service';
import { NgxFileDropEntry } from 'ngx-file-drop/ngx-file-drop/ngx-file-drop-entry';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})




export class FileUploadComponent {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService) { }

  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUploadOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {

    this.files = files;

    const fileData: FormData = new FormData();

    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        if (_file && _file.name) { // Dosya verisi doğru şekilde alınmış mı diye kontrol edin
          fileData.append(_file.name, _file);
        }
      });
    }

    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.spinner.show(SpinnerType.Pacman);
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ "responseType": "blob" })
        }, fileData).subscribe({
          next: (response) => {
            const message: string = "Dosyalar başarıyla yüklenmiştir.";

            this.spinner.hide(SpinnerType.Pacman);
            if (this.options.isAdminPage) {
              this.alertifyService.message(message,
                {
                  dismissOthers: true,
                  messageType: AlertifyMessageType.Success,
                  position: AlertifyPosition.TopRight
                })
            } else {
              this.customToastrService.message(message, "Başarılı.", {
                messageType: ToastrMessageType.Success,
                position: ToastrPosition.TopRight
              })
            }
          },
          error: (err) => {
            const message: string = "Dosyalar yüklenirken beklenmeyen bir hatayla karşılaşılmıştır.";

            this.spinner.hide(SpinnerType.Pacman)
            if (this.options.isAdminPage) {
              this.alertifyService.message(message,
                {
                  dismissOthers: true,
                  messageType: AlertifyMessageType.Error,
                  position: AlertifyPosition.TopRight
                })
            } else {
              this.customToastrService.message(message, "Başarsız.", {
                messageType: ToastrMessageType.Error,
                position: ToastrPosition.TopRight
              })
            }
          },
          complete: () => {
            location.reload();
            const message: string = "İşlem tamamlandı.";

            if (this.options.isAdminPage) {
              this.alertifyService.message(message,
                {
                  dismissOthers: true,
                  messageType: AlertifyMessageType.Success,
                  position: AlertifyPosition.TopRight
                })
            } else {
              this.customToastrService.message(message, "Başarılı.", {
                messageType: ToastrMessageType.Success,
                position: ToastrPosition.TopRight
              })
            }
          }
        });
      }
    });
  }
}



export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}
