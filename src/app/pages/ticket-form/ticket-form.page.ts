import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ChargesPage } from '../charges/charges.page';
import { VehicletypePage } from '../vehicletype/vehicletype.page';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.page.html',
  styleUrls: ['./ticket-form.page.scss'],
})
export class TicketFormPage implements OnInit {

  ticketDetails = {
    Id: "",
    firstname: '',
    reference: '',
    lastname: "",
    address: "",
    licenceCode: "",
    PrDP: "",
    cellnumber: "",
    email: "",
    licenceDisk: "",
    licenceNumber: "",
    vehicleRegistration: "",
    vehicleType: "",
    model: "",
    vehicleColour: "",
    vehicleOwner: "",
    vehicleRegisteredAddress: "",
    chargeCode: "",
    chargeType: "",
    penalty: "",
    dateIssued: "",
    expiryDate: '',
    staffNumber: "",
    lastPaymentDate: ""
  }

  public ticketForm: FormGroup;
  public date = moment().add(0, 'd').format().toString();
  public maxDate = moment().add(7, 'y').format().toString();
  public Province: any;
  chargeList: any;
  ticketList: any;
  isUpdate: any;
  constructor(
    private fb: FormBuilder,
    private Aroute: ActivatedRoute,
    private api: ApiService,
    private toaster: ToasterService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private route: Router,
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) {
    this.ticketDetails.lastPaymentDate = (moment().add(1, 'y').format().toString()).substr(0, 10);

    this.isUpdate = this.navParams.get('isUpdate');
    console.log(this.navParams.get('isUpdate'));


    if (this.isUpdate == false) {

      this.get(this.navParams.get('ID'))
    } else {
      this.ticketDetails = JSON.parse(this.navParams.get('data'))
    }


    this.ticketForm = this.fb.group({
      Id: [this.ticketDetails.Id, Validators.required],
      firstname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern("^[A-Za-z-]*$")])),
      lastname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern("^[A-Za-z-]*$")])),
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])],
      cellnumber: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$"), Validators.required])],
      address: ['', Validators.required],

      licenceNumber: [''],
      licenceCode: [''],
      dateIssued: [''],
      expiryDate: [''],
      PrDP: [''],

      vehicleOwner: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern("^[A-Za-z -]*$")])),
      vehicleRegisteredAddress: ['', Validators.required],
      vehicleType: ['', Validators.required],
      model: ['', Validators.required],
      licenceDisk: new FormControl('', Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9]*$")])),
      vehicleRegistration: ['', Validators.required],
      vehicleColour: ['', Validators.required],

      chargeCode: ['', Validators.required],

    }, {
      validators: [
        this.licenceNumberValidation.bind(this),
        this.licenceCodeValidation.bind(this),
        this.dateIssuedValidation.bind(this),
        this.expiryDateValidation.bind(this),
        this.PrDPValidation.bind(this)
      ]
    });
  }



  licenceNumberValidation(formGroup: FormGroup) {
    const { value: licenceNumber } = formGroup.get('licenceNumber')
    const matchingControl = formGroup.controls['licenceNumber'];
    const control = new FormControl(licenceNumber, Validators.pattern('[a-zA-Z0-9]*'))

    if (licenceNumber != "" || licenceNumber != null) {

      if (control.status == "VALID") {
        return matchingControl.setErrors(null)
      } else {
        return matchingControl.setErrors({ licenceNumberValidation: true });
      }

    } 
  }

  licenceCodeValidation(formGroup: FormGroup) {
    const { value: licenceNumber } = formGroup.get('licenceNumber')
    const { value: licenceCode } = formGroup.get('licenceCode')
    const matchingControl = formGroup.controls['licenceCode'];
   
    if (licenceNumber == "" || licenceNumber == null) {
      return matchingControl.setErrors(null)
    }
   
    if (licenceCode == "" || licenceCode == null) {
      return matchingControl.setErrors({ licenceCodeValidation: true })
    } else {
      return matchingControl.setErrors(null)
    }

  }

  dateIssuedValidation(formGroup: FormGroup) {
    const { value: licenceNumber } = formGroup.get('licenceNumber')
    const { value: dateIssued } = formGroup.get('dateIssued')
    const matchingControl = formGroup.controls['dateIssued'];

    if (licenceNumber == "" || licenceNumber == null) {
      return matchingControl.setErrors(null)
    }

    if (dateIssued == "" || dateIssued == null) {
      return matchingControl.setErrors({ dateIssuedValidation: true })
    } else {
      return matchingControl.setErrors(null)
    }

  }

  PrDPValidation(formGroup: FormGroup) {
    const { value: licenceNumber } = formGroup.get('licenceNumber')
    const { value: PrDP } = formGroup.get('PrDP')
    const matchingControl = formGroup.controls['PrDP'];

    if (licenceNumber == "" || licenceNumber == null) {
      return matchingControl.setErrors(null)
    }

    if (PrDP == "" || PrDP == null) {
      return matchingControl.setErrors({ PrDPValidation: true })
    } else {
      return matchingControl.setErrors(null)
    }
  }

  expiryDateValidation(formGroup: FormGroup) {
    const { value: licenceNumber } = formGroup.get('licenceNumber')
    const { value: dateIssued } = formGroup.get('dateIssued')
    const { value: expiryDate } = formGroup.get('expiryDate')
    const matchingControl = formGroup.controls['expiryDate'];

    if (licenceNumber == "" || licenceNumber == null) {
      return matchingControl.setErrors(null);
    }
    if (expiryDate < dateIssued || expiryDate == null) {
      return matchingControl.setErrors({ expiryDateValidation: true })
    } else {
      return matchingControl.setErrors(null)
    }

  }

  validation_messages = {
    Id: [
      { type: 'required', message: 'ID number is required!' },
    ],
    email: [
      { type: 'required', message: 'Email required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
    firstname: [
      { type: 'required', message: 'First name is required!' },
      { type: 'pattern', message: 'First name should contain letters and hyphen only!' },
      { type: 'minlength', message: 'First name should contain atleast 2 letters!' },
    ],
    lastname: [
      { type: 'required', message: 'Last name is required!' },
      { type: 'pattern', message: 'Last name should contain letters and hyphen only!' },
      { type: 'minlength', message: 'Last name should contain atleast 2 letters!' },
    ],
    cellnumber: [
      { type: 'required', message: 'Cell Number is required!' },
      { type: 'pattern', message: 'Cell number should contain numbers only!' },
      { type: 'minlength', message: 'Cell number should contain 10 numbers!' },
      { type: 'maxlength', message: 'Cell number should contain 10 numbers!' },
    ],
    address: [
      { type: 'required', message: 'Address is required!' },
    ],
    licenceNumber: [
      { type: 'licenceNumberValidation', message: 'Licence number should contain letters and numbers only!' },
    ],
    licenceCode: [
      { type: 'licenceCodeValidation', message: 'Licence Code is required!' },
    ],
    expiryDate: [
      // { type: 'required', message: 'Expiry date is required!' },
      { type: 'expiryDateValidation', message: ' Expiry date must be greater than Date Issued !' },
    ],
    dateIssued: [
      { type: 'dateIssuedValidation', message: 'Date Issued is required!' },

    ],
    PrDP: [
      { type: 'PrDPValidation', message: 'PrDP is required!' },
    ],
    vehicleOwner: [
      { type: 'required', message: 'Vehicle Owner is required!' },
      { type: 'pattern', message: 'Vehicle Owner should contain letters, hyphen and space only!' },
      { type: 'minlength', message: 'Vehicle Owner should contain atleast 2 letters!' },
    ],
    vehicleRegisteredAddress: [
      { type: 'required', message: 'Vehicle Registered Address is required!' },
    ],
    vehicleType: [
      { type: 'required', message: 'Vehicle Type is required!' },
    ],
    model: [
      { type: 'required', message: 'Model is required!' },
    ],
    licenceDisk: [
      { type: 'required', message: 'Licence Disk is required!' },
      { type: 'pattern', message: 'Licence Disk should contain letters and numbers only!' },
    ],
    vehicleRegistration: [
      { type: 'required', message: 'Vehicle registration is required!' },
    ],
    vehicleColour: [
      { type: 'required', message: 'Vehicle Colour is required!' },
    ],
    chargeCode: [
      { type: 'required', message: 'Charge Code is required!' },
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
  ngOnInit() {
  }

  async get(Id) {

    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    await loading.present();

    this.api.driver(Id).subscribe(
      data => {
        if (data.status == 0) {
          this.ticketDetails = data.data;
          console.log(this.ticketDetails)
          loading.dismiss();
          this.toaster.successToast(data.msg);

        } else {
          this.ticketDetails.Id = Id;
          loading.dismiss();
          this.presentAlert(data.msg);
        }
      }, error => {
        loading.dismiss();
        this.presentAlertCheckDriver("Could not connect to server 🖥️, check your internet connection!");

      }
    );
  }

  onChangeHandler(ev) {
    this.ticketDetails.PrDP = ev.detail.value
  }

  async submit() {
    console.log("valid " + this.ticketForm.valid)
    console.log(this.ticketDetails)
    console.log(this.ticketForm);

    if (this.ticketForm.valid) {
      const loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
      });

      await loading.present();

      if (this.isUpdate == false) {
        console.log("sub");

        this.api.add_ticket(this.ticketDetails).subscribe(
          data => {
            if (data.status == 0) {
              loading.dismiss();
              this.toaster.successToast(data.msg);

              this.modalCtrl.dismiss()
              this.ticketForm.reset()
            } else {
              loading.dismiss();
              this.presentAlert(data.msg);
            }
          }, error => {
            loading.dismiss();

            this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
          }
        );
      } else {
        this.api.update_ticket(this.ticketDetails).subscribe(
          data => {
            if (data.status == 0) {
              loading.dismiss();
              this.toaster.successToast(data.msg);

              this.modalCtrl.dismiss()

            } else {
              loading.dismiss();
              this.presentAlert(data.msg);
            }
          }, error => {
            loading.dismiss();
            this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
          }
        );

      }


    } else {
      this.validateAllFormFields(this.ticketForm);
    }

  }

  onSelect(v) {
    this.ticketList = []
    this.ticketDetails.vehicleType = v.vehicleType;
    this.ticketDetails.vehicleRegisteredAddress = v.vehicleRegisteredAddress;
    this.ticketDetails.vehicleRegistration = v.vehicleRegistration;
    this.ticketDetails.vehicleOwner = v.vehicleOwner;
    this.ticketDetails.vehicleColour = v.vehicleColour;
    this.ticketDetails.model = v.model;
    this.ticketDetails.licenceDisk = v.licenceDisk;
  }

  cancelSearch() {
    this.ticketList = []
  }

  filterList(evt) {

    const searchTerm = evt.srcElement.value;
    this.ticketDetails.vehicleRegistration = evt.srcElement.value;

    if (!searchTerm || searchTerm.length < 3) {
      this.ticketList = []
      return;
    }

    this.api.get_vehicle_by_search(searchTerm).subscribe(
      data => {
        if (data.status == 0) {
          this.ticketList = data.data;
          console.log(data.data)
        } else {
          this.presentAlert(data.msg);
        }
      }, error => {
        this.presentAlert(error.message);
      }
    );
  }


  async charges() {
    const modal = await this.modalCtrl.create({
      component: ChargesPage,
    });

    modal.onDidDismiss().then(data => {

      if (data['role'] != 'backdrop') {
        if (data.data != 'close') {
          this.ticketDetails.chargeCode = data.data.chargeCode
          this.ticketDetails.chargeType = data.data.chargeType
          this.ticketDetails.penalty = data.data.penalty
        }
      }
    });

    return await modal.present();
  }

  async addVehicleType() {
    const modal = await this.modalCtrl.create({
      component: VehicletypePage,
    });

    modal.onDidDismiss().then(data => {

      if (data['role'] != 'backdrop') {
        if (data.data != 'close') {
          this.ticketDetails.vehicleType = data.data.vehicleType
        }
      }
    });

    return await modal.present();
  }
  async presentAlertCheckDriver(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'NTA',
      subHeader: 'Caution',
      message: msg,
      buttons: [
        {
          text: 'ohk',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.modalCtrl.dismiss("close")
          }
        },

      ]
    });
    await alert.present();
  }
  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'NTA',
      subHeader: 'Caution',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  close() {
    this.modalCtrl.dismiss("close");
  }
}
