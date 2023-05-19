import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { UserAuthService } from './services/common/models/user-auth.service';
import { Observable } from 'rxjs';
declare var $: any


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fullName: string = "";
  constructor(public authService: AuthService, private toastrService : CustomToastrService, private router: Router,private userAuthService : UserAuthService) {
    authService.identityCheck()

     userAuthService.fullName$.subscribe((fullName) => {
       this.fullName = fullName || ""; 
     });

    const storedFullName = localStorage.getItem('fullName');
    if (storedFullName) {
      this.fullName = storedFullName;
    }
    
  }
  signOut(){
    localStorage.removeItem("accessToken");
    this.authService.identityCheck();
    this.router.navigate([""])
    this.toastrService.message("Oturumunuz başarıyla kapanmıştır","Logout",{
      messageType : ToastrMessageType.Info,
      position : ToastrPosition.TopRight
    })
  }
} 
