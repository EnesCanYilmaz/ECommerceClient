import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { Create_User } from 'src/app/contracts/users/create_user';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,spinner : NgxSpinnerService, private userService: UserService, private toastService: CustomToastrService) {
    super(spinner);
  }

  registerForm: FormGroup;
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullName: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5)
      ]],
      userName: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5)
      ]],
      email: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]],
      password: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(6),
      ]],
      passwordConfirm: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(6)
      ]]
    }, {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let password = group.get("password").value;
        let passwordConfirm = group.get("passwordConfirm").value;
        return password === passwordConfirm ? null : { notSame: true }
      }
    }
    )
  }
  get component() {
    return this.registerForm.controls;
  }
  submitted: boolean = false;

  async onSubmit(user: User) {
    this.submitted = true;

    if (this.registerForm.invalid)
      return;

    const result: Create_User = await this.userService.create(user);

    if (result.succeeded)
    this.toastService.message(result.message, "User Created!", {
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.BottomRight
    })
    else
    this.toastService.message(result.message, "User Not Created!", {
      messageType: ToastrMessageType.Error,
      position: ToastrPosition.BottomRight
    })
  }
}
