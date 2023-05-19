import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  fullName: string = "";

  constructor(private userAuthService: UserAuthService, spinner: NgxSpinnerService, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private router: Router, private socialAuthService: SocialAuthService,) {
    super(spinner);
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user);
      this.showSpinner(SpinnerType.Pacman)
      switch (user.provider) {
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => { })
          this.router.navigate(['']).then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 50);
          });
          break;
      }
    });
    this.authService.identityCheck();
    this.hideSpinner(SpinnerType.Pacman)
  }

  ngOnInit(): void {

  }

  async loginUser(userNameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.Pacman)
    await this.userAuthService.login(userNameOrEmail, password, () => {
      this.authService.identityCheck();
      this.hideSpinner(SpinnerType.Pacman)
    });
    this.router.navigate(['']).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 50);
    })
  }
}