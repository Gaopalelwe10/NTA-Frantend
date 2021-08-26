import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { TicketFormPage } from '../pages/ticket-form/ticket-form.page';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {
	qrData = 'https://ionicacademy.com';
	scannedCode = null;
	elementType: 'url' | 'canvas' | 'img' = 'canvas';

	constructor(
		private barcodeScanner: BarcodeScanner,
		public modalCtrl: ModalController,
		private base64ToGallery: Base64ToGallery,

		private navC: NavController,
	) { }

	IDForm = new FormGroup({
		ID: new FormControl('', Validators.compose([Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern("^[0-9]*$"), Validators.required])),
	}, {
		validators: this.validateID.bind(this)
	});

	validateID(formGroup: FormGroup) {
		const { value: ID } = formGroup.get('ID')
		const matchingControl = formGroup.controls['ID'];
		// if (matchingControl.errors && !matchingControl.errors.validateID) {
		//   // return if another validator has already found an error on the matchingControl
		//   return;
		// }
		var idnumber = ID,
			invalid = 0;

		// display debugging
		// var debug = $('#debug');

		// check that value submitted is a number
		if (isNaN(idnumber)) {
			// debug.append('Value supplied is not a valid number.<br />');
			invalid++;
		}

		// check length of 13 digits
		if (idnumber.length != 13) {
			// debug.append('Number supplied does not have 13 digits.<br />');
			invalid++;
		}


		// check that YYMMDD group is a valid date
		var yy = idnumber.substring(0, 2),
			mm = idnumber.substring(2, 4),
			dd = idnumber.substring(4, 6);

		var dob = new Date(yy, (mm - 1), dd);

		// check values - add one to month because Date() uses 0-11 for months
		if (!(((dob.getFullYear() + '').substring(2, 4) == yy) && (dob.getMonth() == mm - 1) && (dob.getDate() == dd))) {
			// debug.append('Date in first 6 digits is invalid.<br />');
			invalid++;
		}

		// evaluate GSSS group for gender and sequence 
		var gender = parseInt(idnumber.substring(6, 10), 10) > 5000 ? "M" : "F";

		// ensure third to last digit is a 1 or a 0
		if (idnumber.substring(10, 11) > 1) {
			// debug.append('Third to last digit can only be a 0 or 1 but is a ' + idnumber.substring(10, 11) + '.<br />');
			invalid++;
		} else {
			// determine citizenship from third to last digit (C)
			var saffer = parseInt(idnumber.substring(10, 11), 10) === 0 ? "C" : "F";
		}

		// ensure second to last digit is a 8 or a 9
		if (idnumber.substring(11, 12) < 8) {
			// debug.append('Second to last digit can only be a 8 or 9 but is a ' + idnumber.substring(11, 12) + '.<br />');
			invalid++;
		}

		// calculate check bit (Z) using the Luhn algorithm
		var ncheck = 0,
			beven = false;

		for (var c = idnumber.length - 1; c >= 0; c--) {
			var cdigit = idnumber.charAt(c),
				ndigit = parseInt(cdigit, 10);

			if (beven) {
				if ((ndigit *= 2) > 9) ndigit -= 9;
			}

			ncheck += ndigit;
			beven = !beven;
		}

		if ((ncheck % 10) !== 0) {
			// debug.append('Checkbit is incorrect.<br />');
			invalid++;
		}

		// if one or more checks fail, display details
		if (invalid > 0) {
			// debug.css('display', 'block');
		}

		return (ncheck % 10) === 0 ? null : matchingControl.setErrors({ validateID: true })
	}


	validation_messages = {
		'ID': [
			{ type: 'required', message: 'ID number is required!' },
			{ type: 'pattern', message: 'ID number should contain numbers only!' },
			{ type: 'minlength', message: 'ID number should contain 13 numbers!' },
			{ type: 'maxlength', message: 'ID number should contain 13 numbers!' },
			{ type: 'validateID', message: 'Please enter a valid South African ID number!' },
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


	scanCode() {
		const options: BarcodeScannerOptions = {
			preferFrontCamera: false,
			showFlipCameraButton: true,
			showTorchButton: true,
		};
		this.barcodeScanner.scan(options).then((barcodeData) => {
			this.scannedCode = barcodeData.text;
			this.IDForm.setValue({ ID: this.scannedCode })
		});
	}
	
	async submit() {
		if (this.IDForm.valid) {

			const modal = await this.modalCtrl.create({
				component: TicketFormPage,

				componentProps: {
					ID: this.IDForm.value.ID,
					isUpdate: false,
				},
			});

			modal.onDidDismiss().then(data => {
				console.log(data)
				if (data['role'] != 'backdrop') {

				}

				if (data.data != 'close') {
					this.IDForm.reset();
				}

			});

			return await modal.present();

		} else {
			this.validateAllFormFields(this.IDForm);
		}

	}
}
