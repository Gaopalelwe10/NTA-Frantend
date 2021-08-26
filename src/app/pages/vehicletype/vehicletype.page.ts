import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-vehicletype',
  templateUrl: './vehicletype.page.html',
  styleUrls: ['./vehicletype.page.scss'],
})
export class VehicletypePage implements OnInit {
  vehicleTypeList;
  vehicleTypeListLoaded;
  data = false;
  isSearchbar: boolean=false;
  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private modalCtrl: ModalController
  ) { 
    this.init();
  }

  ngOnInit() {
  }

  async init() {
    this.api.get_all_vehicletype().subscribe(
      data => {
        if (data.status == 0) {
          this.vehicleTypeList = data.data;
          this.vehicleTypeListLoaded = data.data;
          // this.count = data.data.length;
          this.data=true
        } else {
          this.data=true
          this.presentAlert(data.msg);
        }
      }, error => {
        this.data=true
        this.presentAlert("Could not connect to server 🖥️, check your internet connection!");

      }
    );
  }

  doRefresh(event) {
    this.data = false
    setTimeout(() => {

      this.init()
      event.target.complete();
    }, 500)
  }

  initializeItems(): void {
    this.vehicleTypeList = this.vehicleTypeListLoaded;
  }

  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.vehicleTypeList = this.vehicleTypeListLoaded.filter(currentOpp => {
      if ( (currentOpp.vehicleType && searchTerm)) {
        if ( (currentOpp.vehicleType.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) ) {
          return true;
        }
        return false;
      }
    });

  }

  onSelect(v){
    this.modalCtrl.dismiss(v);
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


  close() {
    this.modalCtrl.dismiss("close");
  }

}
