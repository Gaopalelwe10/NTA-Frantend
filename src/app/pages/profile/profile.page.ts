import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ChangepasswordPage } from '../changepassword/changepassword.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileDetails = {
    firstname: '',
    lastname: '',
    email: '',
    cellnumber: '',
    stuffNumber:'',
  }
  public profileForm: FormGroup;
  public Province: any;
  data=false
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toaster: ToasterService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private modalCtrl:ModalController
  ) {
    this.profileForm = this.fb.group({
      firstname: new FormControl('', Validators.compose([Validators.required , Validators.minLength(2), Validators.pattern("^[A-Za-z-]*$")])),
      lastname: new FormControl('', Validators.compose([Validators.required,Validators.minLength(2), Validators.pattern("^[A-Za-z-]*$")])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])),
      cellnumber: new FormControl('', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$"), Validators.required])),
    });
  }

  ngOnInit() {
  }

  validation_messages = {
    'firstname': [
      { type: 'required', message: 'First name is required!' },
      { type: 'pattern', message: 'First name should contain letters and hyphen only!' },
      { type: 'minlength', message: 'Firstn ame should contain atleast 2 letters!' },
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required!' },
      { type: 'pattern', message: 'Last name should contain letters and hyphen only!' },
      { type: 'minlength', message: 'last name should contain atleast 2 letters!' },
    ],
    'cellnumber': [
      { type: 'required', message: 'Cell number is required!' },
      { type: 'pattern', message: 'Cell number should contain numbers only' },
      { type: 'minlength', message: 'Cell number should contain 10 numbers!' },
      { type: 'maxlength', message: 'Cell number should contain 10 numbers!' },
    ],
    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
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

  ionViewWillEnter() {
    this.doGetUser()
  }

  doRefresh(event){
    this.data=false;
    setTimeout(()=>{
      this.doGetUser()
      event.target.complete();
    }, 500)
  }

  async doGetUser() {
    this.authService.get_user().subscribe(
      response => {
        this.data=true;
        if (response.status == 0) {
         
          this.profileDetails.firstname=response.data[0].firstname
          this.profileDetails.lastname=response.data[0].lastname
          this.profileDetails.email=response.data[0].email
          this.profileDetails.cellnumber=response.data[0].cellnumber
          this.profileForm.controls['email'].disable();
        } else {
          this.presentAlert(response.msg);
        }
      }, error => {
        this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
        this.data=true;
      }
    );
  }



  async UpdateProfile() {

    console.log(this.profileForm.valid);

    if (this.profileForm.valid) {

      const loading = this.loadingCtrl.create({
        message: 'Updating, Please wait...',
        // showBackdrop: false,
        cssClass: 'custom-loader',
        spinner: "crescent",
      });

      (await loading).present();

      this.api.update_officer(this.profileDetails).subscribe(
        async data => {

          if (data.status == 0) {
            (await loading).dismiss();
            console.log(data);
            this.toaster.successToast(data.msg);

          } else {
            (await loading).dismiss();
            this.presentAlert(data.msg);
          }
        }, async error => {
          (await loading).dismiss();
          this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
        })

    } else {
      this.validateAllFormFields(this.profileForm);
    }
  }

  async changepassword() {
    const modal = await this.modalCtrl.create({
      component: ChangepasswordPage,
      cssClass: 'ChangePassword-modal-css',
    
    });

    modal.onDidDismiss().then(async data => {
     
      if (data['role'] != 'backdrop') {
       
        if(data.data != "close"){
          const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
          });
          await loading.present();
          
          this.api.update_password(data.data).subscribe(
            data => {
              if (data.status == 0) {
                loading.dismiss();
                this.toaster.successToast(data.msg);
              } else {
                loading.dismiss();
                this.presentAlert(data.msg);
              }
            }, error => {
              loading.dismiss();
              this.presentAlert(error.message);
            }
          )
        }
      
      }
     
    });
 

    return await modal.present();
  }
  async changePass() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Change Password!',
      inputs: [
        {
          name: 'pass',
          type: 'password',
          placeholder: 'New Password',
          cssClass: 'specialClass',
          attributes: {
            maxlength: 6,
            inputmode: 'decimal'
          }
        },
        {
          name: 'pass1',
          type: 'password',
          placeholder: 'Confirm Password',
          cssClass: 'specialClass',
          attributes: {
            maxlength: 6,
            inputmode: 'decimal'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.doChangePassword(data.pass, data.pass1);
          }
        }
      ]
    });

    await alert.present();
  }

  async doChangePassword(password, password1) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    if (password == '' || password1 == '') {
      this.presentAlert('Password fields required ⚠️');
    } else if (password.length <6) {
      this.presentAlert('Password should contain atleast 6 characters! 👎❌');
    }else if (password1 != password) {
      this.presentAlert('Passwords do not match! ❌');
    } 
    else {
      await loading.present();
      this.api.update_password(password).subscribe(
        data => {
          if (data.status == 0) {
            loading.dismiss();
            this.toaster.successToast(data.msg);
          } else {
            loading.dismiss();
            this.presentAlert(data.msg);
          }
        }, error => {
          loading.dismiss();
          this.presentAlert(error.message);
        }
      );
    }
  }

  logout() {
    this.authService.logout();
   
  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'NTA',
      subHeader: 'Warning',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  alert(err) {

    this.alertCtrl.create({
      message: err.message,
      buttons: ['Ok'],
      cssClass: 'custom-alert',
    }).then(
      alert => alert.present()
    );
  }

}
