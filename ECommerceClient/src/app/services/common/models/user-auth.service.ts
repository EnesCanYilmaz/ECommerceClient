import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private fullNameSubject = new Subject<string| undefined>();
  fullName$ = this.fullNameSubject.asObservable();

  constructor(private httpClientService: HttpClientService, private toastrService: CustomToastrService) {
    const storedFullName = localStorage.getItem('fullName');
    if (storedFullName) {
      this.fullNameSubject.next(storedFullName);
    }
   }

  async login(userNameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "loginuser"
    }, {
      userNameOrEmail, password
    });

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;


    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("fullName", tokenResponse.fullName);

      this.fullNameSubject.next(tokenResponse.fullName);

      this.toastrService.message("Kullanıcı girişi başarılı.", "Giriş başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.BottomRight
      })
    }
    callBackFunction();
  }




  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller: "auth",
      action: "google-login"
    }, user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("fullName", tokenResponse.fullName);

      this.fullNameSubject.next(tokenResponse.fullName);


      this.toastrService.message("Kullanıcı girişi başarılı.", "Giriş başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.BottomRight
      })
    }
    callBackFunction();
  }
}
