import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

  showPassword: boolean =false;
  showConfirmPassword: boolean =false;
 
  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  togglePasswordText() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordText() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ChangePasswordForm = new FormGroup({
   password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6),
       Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9\d$@$!%*?&].{5,}")
    ])),
    cpassword: new FormControl('', Validators.required)
  }, {
    validators: this.passwordMatcher.bind(this)
  });

  passwordMatcher(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password')
    const { value: cpassword } = formGroup.get('cpassword')
    const matchingControl = formGroup.controls['cpassword'];
    if (matchingControl.errors && !matchingControl.errors.passwordMatcher) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    return password === cpassword ? null : matchingControl.setErrors({ passwordMatcher: true })
  }

  validation_messages = {
    'firstname': [
      { type: 'required', message: 'Firstname is required!' },
      { type: 'pattern', message: 'Firstname should contain letters and hyphen only!' },
      { type: 'minlength', message: 'Firstname should contain atleast 2 letters!' },
    ],
    'lastname': [
      { type: 'required', message: 'Lastname is required!' },
      { type: 'pattern', message: 'Lastname should contain letters and hyphen only!' },
      { type: 'minlength', message: 'Lastname should contain atleast 2 letters!' },
    ],
    'cellnumber': [
      { type: 'required', message: 'Cell number is required!' },
      { type: 'pattern', message: 'Cell number should contain numbers only!' },
      { type: 'minlength', message: 'Cell number should contain 10 numbers!' },
      { type: 'maxlength', message: 'Cell number should contain 10 numbers!' },
    ],
    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],

    'password': [
      { type: 'required', message: 'Password is required!' },
      { type: 'minlength', message: 'Password should contain atleast 6 characters!' },
      { type: 'pattern', message: 'Password should contain characters, numbers, lowercase and uppercase letters!' },
    ],
    'cpassword': [
      { type: 'required', message: 'Confirm password is required!' },
      { type: 'passwordMatcher', message: 'Passwords dont match!' },
    ]
  };

  
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  ChangePasswordFormF(){
    if (this.ChangePasswordForm.valid) {
      this.modalCtrl.dismiss(this.ChangePasswordForm.value.password)
    } else {
      this.validateAllFormFields(this.ChangePasswordForm);
    }
  }

  cancel(){
    this.modalCtrl.dismiss("close")
  }

}
