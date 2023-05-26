import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/common/auth.service';
import { CustomValidator } from 'src/app/common/custom.validator';
import { FetchApiService } from 'src/app/common/fetch-api.service';

class InputErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl<any, any> | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public tokenInputFormControl;
  public matcher = new InputErrorStateMatcher();

  constructor(private authService: AuthService, private fetchApiService: FetchApiService) {
    this.tokenInputFormControl = new FormControl('', [Validators.required], [CustomValidator.tokenValidator(this.fetchApiService)])
  }

  async saveToken() {

    if (!this.tokenInputFormControl.valid) return;

    this.authService.saveTokenOnStorage(this.tokenInputFormControl.value!);
    this.authService.checkIsAuthenticated();
    this.tokenInputFormControl.reset();
  }

}
